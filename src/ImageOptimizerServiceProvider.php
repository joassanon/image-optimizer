<?php
namespace Vendor\ImageOptimizer;

use Illuminate\Support\ServiceProvider;

/**
 * Laravel service provider for the image optimizer package.
 */
class ImageOptimizerServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services: load routes and publish configuration/resources.
     *
     * @return void
     */
    public function boot()
    {
        $this->loadRoutesFrom(__DIR__.'/../routes/web.php');
        $this->publishes([__DIR__.'/../config/image-optimizer.php' => config_path('image-optimizer.php')], 'config');
        $this->publishes([__DIR__.'/../Resources' => resource_path('vendor/image-optimizer')], 'resources');
    }

    /**
     * Register package services and merge default configuration.
     *
     * @return void
     */
    public function register()
    {
        $this->mergeConfigFrom(__DIR__.'/../config/image-optimizer.php', 'image-optimizer');
    }
}
