<?php

namespace App\Http\Controllers;

use App\Models\Track;
use Illuminate\Http\Request;
use Illuminate\View\View;

class CatalogController extends Controller
{
    public function index(Request $request): View
    {
        $term = trim((string) $request->query('q', ''));
        $query = Track::query();

        if ($term !== '') {
            $query->where(function ($tracks) use ($term): void {
                $like = '%' . addcslashes($term, '%_') . '%';
                $tracks->where('title', 'like', $like)
                    ->orWhere('artist', 'like', $like)
                    ->orWhere('category', 'like', $like)
                    ->orWhere('lyrics', 'like', '%"text":"%' . addcslashes($term, '%_') . '%"%');
            });
        }

        return view('catalog.index', [
            'tracks' => $query->latest()->paginate(12)->withQueryString(),
            'search' => $term,
        ]);
    }
}
