<?php

it('registers the image optimizer route', function () {
    $route = $this->app['router']->getRoutes()->getByName('images.show');

    expect($route)->not->toBeNull();
});
