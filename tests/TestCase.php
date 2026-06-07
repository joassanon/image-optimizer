<?php

namespace Tests;

use Orchestra\Testbench\TestCase as BaseTestCase;
use Vendor\ImageOptimizer\ImageOptimizerServiceProvider;

abstract class TestCase extends BaseTestCase
{
    protected function getPackageProviders($app)
    {
        return [
            ImageOptimizerServiceProvider::class,
        ];
    }

    protected function getEnvironmentSetUp($app)
    {
        $app['config']->set('app.url', 'http://localhost');
    }
}
