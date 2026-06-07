<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Allowed source prefixes
    |--------------------------------------------------------------------------
    |
    | Comma-separated list (or single value) of allowed path prefixes for
    | the `src` parameter. Example: "images/,uploads/"
    |
    */
    'allowed_prefixes' => array_filter(array_map('trim', explode(',', env('IMAGE_OPTIMIZER_ALLOWED_PREFIXES', 'images/')))),

    /*
    |--------------------------------------------------------------------------
    | Maximum width
    |--------------------------------------------------------------------------
    |
    | Maximum allowed width for generated images. This protects the server
    | from excessive resize requests.
    |
    */
    'max_width' => (int) env('IMAGE_OPTIMIZER_MAX_WIDTH', 5000),

    /*
    |--------------------------------------------------------------------------
    | Storage disk
    |--------------------------------------------------------------------------
    |
    | Filesystem disk used to read original images and store cached variants.
    | Defaults to the Laravel `FILESYSTEM_DRIVER` environment variable.
    |
    */
    'disk' => env('IMAGE_OPTIMIZER_DISK', env('FILESYSTEM_DRIVER', 'public')),

    /*
    |--------------------------------------------------------------------------
    | Cache path
    |--------------------------------------------------------------------------
    |
    | Relative path on the configured disk where generated variants are
    | stored.
    |
    */
    'cache_path' => env('IMAGE_OPTIMIZER_CACHE_PATH', 'img-cache'),
];
