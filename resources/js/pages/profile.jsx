import React from 'react';

const Profile = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
        <p className="font-bold">Perhatian!</p>
        <p>Halaman sedang dalam pengembangan. Mohon maaf atas ketidaknyamanannya.</p>
        <p>This page is under development. We apologize for the inconvenience.</p>
      </div>
      
      {/* Placeholder untuk konten yang akan datang */}
      <h1 className="text-3xl font-bold mb-4">Tentang Kami</h1>
      <p className="text-gray-700">
        Konten halaman Tentang Kami akan segera hadir. Silakan kunjungi kembali nanti.
      </p>
    </div>
  );
};

export default Profile;
