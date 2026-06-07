<?php

it('generates optimized image urls for responsive widths', function () {
    $result = optimized_image_urls('images/photo.jpg', [320, 640], 80, 'webp');

    expect($result)->toBeArray();
    expect($result['src'])->toContain('src=images%2Fphoto.jpg');
    expect($result['srcset'])->toContain('320w');
    expect($result['srcset'])->toContain('640w');
});
