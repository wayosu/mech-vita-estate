'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const Page: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cache, setCache] = useState<Map<string, any[]>>(new Map());

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      // Inisialisasi peta
      mapInstance.current = L.map(mapRef.current, {
        center: [0.5477, 123.0615], // Koordinat Gorontalo
        zoom: 15,
        attributionControl: false, // Menonaktifkan title Leaflet dan OpenStreetMap
      });
    }
  }, []);

  const fetchResults = useCallback(
    async (searchQuery: string) => {
      // Cek di cache dulu
      if (cache.has(searchQuery)) {
        setResults(cache.get(searchQuery) || []);
        setIsLoading(false);
        return;
      }
  
      try {
        // Encode query untuk menghindari karakter khusus yang bermasalah
        const encodedQuery = encodeURIComponent(searchQuery);
        const url = `https://nominatim.openstreetmap.org/search?format=json&accept-language=id&q=${encodedQuery}&countrycodes=ID`;
  
        console.log('Fetching URL:', url); // Debug URL API
  
        const response = await fetch(url);
        const data = await response.json();
  
        if (data && data.length > 0) {
          setResults(data);
          setCache(new Map(cache.set(searchQuery, data))); // Simpan ke cache
        } else {
          console.warn('No results found from API:', data); // Debug jika kosong
          setResults([]);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [cache]
  );  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      setIsLoading(true);

      // Debouncing: Tunggu 300ms sebelum melakukan fetch
      const timeoutId = setTimeout(() => {
        fetchResults(value);
      }, 300);

      return () => clearTimeout(timeoutId); // Bersihkan timeout sebelumnya
    } else {
      setResults([]);
      setIsLoading(false);
    }
  };

  const handleResultClick = (result: any) => {
    if (mapInstance.current) {
      const latLng = new L.LatLng(result.lat, result.lon);
      mapInstance.current.setView(latLng, 13);
      L.marker(latLng).addTo(mapInstance.current).bindPopup(result.display_name).openPopup();
    }
  };

  return (
    <div className='flex flex-col gap-4 items-center justify-center max-w-lg mx-auto'>
      <h1 className='text-3xl font-bold'>Create Your Ads</h1>
      <Card className='p-4 w-full'>
        <CardDescription className='text-base mb-2 text-center'>
          Enter the address you want to list
        </CardDescription>
        <div className='relative w-full'>
          <Input
            placeholder='Search for an address...'
            value={query}
            onChange={handleInputChange}
            className='mb-2'
          />
          {isLoading && (
            <div className='absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-1 z-10 flex justify-center items-center p-4'>
              <div className='w-5 h-5 border-4 border-black border-t-transparent border-solid rounded-full animate-spin'></div>
            </div>
          )}
          {!isLoading && results.length === 0 && query.length > 2 && (
            <div className='absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-1 z-10 p-4 text-center text-gray-500'>
              Tidak ada hasil ditemukan
            </div>
          )}
          {results.length > 0 && !isLoading && (
            <div className='absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-1 z-10 transition-all duration-300'>
              {results.map((result, index) => (
                <div
                  key={index}
                  className='cursor-pointer p-2 hover:bg-gray-200'
                  onClick={() => handleResultClick(result)}
                >
                  {result.display_name}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Page;
