<?php
namespace Vendor\ImageOptimizer;

use Illuminate\Support\ServiceProvider;

class ImageOptimizerServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $this->loadRoutesFrom(__DIR__.'/../routes/web.php');
        $this->publishes([__DIR__.'/../config/image-optimizer.php' => config_path('image-optimizer.php')], 'config');
        $this->publishes([__DIR__.'/../Resources' => resource_path('vendor/image-optimizer')], 'resources');
    }

    public function register()
    {
        $this->mergeConfigFrom(__DIR__.'/../config/image-optimizer.php', 'image-optimizer');
    }
}
