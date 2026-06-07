<?php

use Illuminate\Support\Facades\URL;

if (! function_exists('optimized_image_urls')) {
    function optimized_image_urls(string $src, array $widths = null, $quality = 75, $format = null)
    {
        $widths ??= [320,480,768,1024,1366,1600,1920];
        $base = url('/img');
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
