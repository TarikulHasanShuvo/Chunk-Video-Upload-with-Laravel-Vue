
    public function uploadVideoUsingChunk(){
        $request = request();
        $file = request()->file('file');
        self::makeDir('uploads/videos');

        $path = Storage::disk('public')->path("uploads/videos/{$file->getClientOriginalName()}");

        File::append($path, $file->get());
        $name = $file->getClientOriginalName();

        if ($request->has('is_last') && $request->boolean('is_last')) {
            $name = time() . basename($path, '.part');

            File::move($path, Storage::disk('public')->path("uploads/videos/{$name}"));
        }

        return response()->json(['path' => $name]);
    }

    private static function makeDir($dir){
        if(!Storage::exists($dir)){
            Storage::disk('public')->makeDirectory($dir);
        }
    }