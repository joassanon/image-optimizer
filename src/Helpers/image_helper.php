<?php

use Illuminate\Support\Facades\URL;

if (! function_exists('optimized_image_urls')) {
    /**
     * Build optimized image URLs for a set of responsive widths.
     *
     * @param string $src Local image source path
     * @param array|null $widths Custom width values to create srcset entries
     * @param int $quality Image quality from 10 to 95
     * @param string|null $format Optional output format, e.g. webp or avif
     * @return array{src:string,srcset:string}
     */
    function optimized_image_urls(string $src, array $widths = null, $quality = 75, $format = null)
    {
        $widths ??= [320,480,768,1024,1366,1600,1920];
        $base = URL::to('/img');
        $sources = [];
        foreach ($widths as $w) {
            $query = http_build_query(['src' => $src, 'w' => $w, 'q' => $quality, 'fm' => $format]);
            $sources[] = "{$base}?{$query} {$w}w";
        }
        $defaultQuery = http_build_query(['src' => $src, 'w' => end($widths), 'q' => $quality, 'fm' => $format]);
        return [
            'src' => "{$base}?{$defaultQuery}",
            'srcset' => implode(', ', $sources),
        ];
    }
}
