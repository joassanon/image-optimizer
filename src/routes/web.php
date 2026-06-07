<?php
use Illuminate\Support\Facades\Route;
use Vendor\ImageOptimizer\Http\Controllers\ImageController;

Route::get('img', [ImageController::class, 'show'])->name('images.show');
