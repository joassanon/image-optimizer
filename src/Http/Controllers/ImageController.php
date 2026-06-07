<?php
namespace Vendor\ImageOptimizer\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManagerStatic as Image;
use Spatie\ImageOptimizer\OptimizerChainFactory;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ImageController extends BaseController
{
    public function show(Request $request)
    {
        $src = $request->query('src');
        $width = (int) $request->query('w', 0);
        $quality = (int) $request->query('q', 75);
        $format = $request->query('fm');
        $fit = $request->query('fit', 'max');

        if (! $src) abort(400);
        $src = ltrim($src, '/');

        $allowedPrefixes = config('image-optimizer.allowed_prefixes', ['images/']);
        $matched = false;
        foreach ($allowedPrefixes as $p) {
            if (Str::startsWith($src, $p)) {
                $matched = true;
                break;
            }
        }

        if (! $matched) {
            abort(403);
        }

        $disk = config('image-optimizer.disk', config('filesystems.default', 'public'));
        if (! Storage::disk($disk)->exists($src)) abort(404);

        $accept = $request->header('Accept', '');
        if (! $format) {
            if (str_contains($accept, 'image/avif')) $format = 'avif';
            elseif (str_contains($accept, 'image/webp')) $format = 'webp';
            else $format = pathinfo($src, PATHINFO_EXTENSION) ?: 'jpg';
        }

        $maxWidth = (int) config('image-optimizer.max_width', 5000);
        $width = max(0, min($maxWidth, $width));
        $quality = max(10, min(95, $quality));

        $cachePath = config('image-optimizer.cache_path', 'img-cache');
        $hash = substr(md5($src . '|' . $width . '|' . $quality . '|' . $format . '|' . $fit), 0, 16);
        $cachedPath = "{$cachePath}/{$hash}.{$format}";

        // If cached on disk
        if (Storage::disk($disk)->exists($cachedPath)) {
            return $this->respondWithStorageFile($disk, $cachedPath, $format);
        }

        // Generate variant locally
        $tmp = tempnam(sys_get_temp_dir(), 'img');
        file_put_contents($tmp, Storage::disk($disk)->get($src));

        Image::configure(['driver' => extension_loaded('imagick') ? 'imagick' : 'gd']);
        $img = Image::make($tmp);

        if ($width > 0) {
            if ($fit === 'crop') {
                $img->fit($width, intval($width * ($img->height() / $img->width())));
            } else {
                $img->resize($width, null, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });
            }
        }

        $img->encode($format, $quality);
        $tmpOut = $tmp . '.' . $format;
        $img->save($tmpOut);

        try {
            $optimizer = OptimizerChainFactory::create();
            $optimizer->optimize($tmpOut);
        } catch (\Throwable $e) {}

        Storage::disk($disk)->put($cachedPath, fopen($tmpOut, 'r'), 'public');

        @unlink($tmp);
        @unlink($tmpOut);

        return $this->respondWithStorageFile($disk, $cachedPath, $format);
    }

    protected function respondWithStorageFile($disk, $path, $format)
    {
        // If local disk, return file path, else stream
        if (Storage::disk($disk)->getDriver()->getAdapter() instanceof \League\Flysystem\Local\LocalFilesystemAdapter) {
            $full = Storage::disk($disk)->path($path);
            $resp = new BinaryFileResponse($full);
        } else {
            $stream = Storage::disk($disk)->readStream($path);
            $resp = response()->stream(function() use ($stream) {
                fpassthru($stream);
            }, 200, []);
            if (is_resource($stream)) fclose($stream);
        }
        $resp->headers->set('Content-Type', $this->mimeForFormat($format));
        $resp->headers->set('Cache-Control', 'public, max-age=2592000, immutable');
        return $resp;
    }

    protected function mimeForFormat($format)
    {
        return match (strtolower($format)) {
            'webp' => 'image/webp',
            'avif' => 'image/avif',
            'png' => 'image/png',
            'gif' => 'image/gif',
            default => 'image/jpeg',
        };
    }
}
