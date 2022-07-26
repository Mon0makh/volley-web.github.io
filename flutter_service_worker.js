'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "5f2d91ef3750d8d51d96d3e31296d9b4",
"assets/assets%255CDevki.png": "3987de366dd5b63108c0c54606766ac2",
"assets/assets%255Cfonts%255CUbuntu-B.ttf": "008e6bc48c8eaa5d2855d57e6b0b8595",
"assets/assets%255Cfonts%255CUbuntu-BI.ttf": "f270899858f8204b62043167ac8d9552",
"assets/assets%255Cfonts%255CUbuntu-C.ttf": "cd5e0e3fba97e8b64cf301bbb350d7cf",
"assets/assets%255Cfonts%255CUbuntu-L.ttf": "2759de5c01527bd9730b4d1838e6c938",
"assets/assets%255Cfonts%255CUbuntu-LI.ttf": "d8d09723b71ebb22bc31881877609622",
"assets/assets%255Cfonts%255CUbuntu-M.ttf": "2aaaafd5fe853746266cad7eafcc871e",
"assets/assets%255Cfonts%255CUbuntu-MI.ttf": "137201ae9563c760964063e122d587b7",
"assets/assets%255Cfonts%255CUbuntu-R.ttf": "7f0b42d1d6a4d3e646c558185f6711ea",
"assets/assets%255Cfonts%255CUbuntu-RI.ttf": "6da3b4e2adcbcf2889e59c81d2326a43",
"assets/assets%255Cfonts%255CUbuntu-Th.ttf": "aa86b62c3f49f4bf0c6d7611dedfae6d",
"assets/assets%255Cfonts%255CUbuntuMono-B.ttf": "0734aff79a8af321fb865c9ac2ef3e64",
"assets/assets%255Cfonts%255CUbuntuMono-BI.ttf": "b935f119fe77bc5939c82f48d6ba1782",
"assets/assets%255Cfonts%255CUbuntuMono-R.ttf": "9383f4b0bc1d264a5a7e094eb1ed0c0b",
"assets/assets%255Cfonts%255CUbuntuMono-RI.ttf": "ee339fa5faeec9d644c8097583298d07",
"assets/assets%255Cfront.png": "0e65d60ed6b73332e679cb8eacc7c5ea",
"assets/assets%255Cfront_header.png": "c873704be3fa9446aeabad5b23c9f0c5",
"assets/assets%255CLOGO.svg": "5679213e05edf14589be2060c31d9a3c",
"assets/assets%255CSignIn.png": "c0c1de96fd1a3a4fdc7a08113001454c",
"assets/assets%255CUserIcon.svg": "a03fdd063ea88f4c48f8eaaf60dace0e",
"assets/FontManifest.json": "6b0f4ef43d825dd5152818554f00b721",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/NOTICES": "790f84693401737ea13a7288a4644896",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "eb2682e33f25cd8f1fc59011497c35f8",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "d8a842214e16fde6e9142d871dc2a402",
"/": "d8a842214e16fde6e9142d871dc2a402",
"main.dart.js": "735936031fc0f1baa2100679f9ed0714",
"manifest.json": "fe442640510480272d0aeeaae4771675",
"version.json": "2525bf46980fde72fa07fb0ef996735f"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
