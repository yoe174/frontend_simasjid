"use client";

import Image from "next/image";
import { useState } from "react";
import { Dialog } from "@headlessui/react";

const eventsData = [
  {
    title: "Rapat pengurus masjid",
    description:
      "Karnaval tahun ini tidak hanya sekedar parade kostum indah tetapi juga sebuah perayaan keberagaman budaya dan kreativitas lokal.",
    image: "/image/rapatmasjid.jpg",
  },
  {
    title: "Pengajian",
    description:
      "Kegiatan pengajian ini tidak hanya dilaksanakan di awal Ramadhan namun dilaksanakan secara berkesinambungan.",
    image: "/image/pengajian.jpg",
  },
  {
    title: "Kerja Bakti",
    description:
      "Pada hari Sabtu pagi yang cerah, lebih dari 200 warga berkumpul di lapangan desa untuk mengambil bagian dalam kerja bakti.",
    image: "/image/kerjabakti.jpg",
  },
  {
    title: "Galang Dana",
    description:
      "Kegiatan pengajian ini tidak hanya dilaksanakan di awal Ramadhan namun dilaksanakan secara berkesinambungan.",
    image: "/image/galangdana.jpg",
  },
  {
    title: "Galang Dana",
    description:
      "Kegiatan pengajian ini tidak hanya dilaksanakan di awal Ramadhan namun dilaksanakan secara berkesinambungan.",
    image: "/image/galangdana.jpg",
  },
  {
    title: "Galang Dana",
    description:
      "Kegiatan pengajian ini tidak hanya dilaksanakan di awal Ramadhan namun dilaksanakan secara berkesinambungan.",
    image: "/image/galangdana.jpg",
  },
];

const EventsSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<null | typeof eventsData[0]>(null);

  const openModal = (event: typeof eventsData[0]) => {
    setSelectedEvent(event);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedEvent(null);
  };

  return (
    <section className="py-12 px-6 bg-white">
      <h2 className="text-2xl font-bold mb-6 text-black">Berita Acara</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {eventsData.map((event, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-110"
          >
            <Image
              src={event.image}
              alt={event.title}
              width={300}
              height={200}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-black">{event.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{event.description}</p>
              <button
                onClick={() => openModal(event)}
                className="text-red-500 font-medium mt-4 block"
              >
                Lihat Selengkapnya
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onClose={closeModal} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black opacity-30" />
          <div className="bg-white rounded-lg max-w-md mx-auto p-6 z-50 relative shadow-xl">
            {selectedEvent && (
              <>
                <Image
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  width={400}
                  height={250}
                  className="rounded-lg object-cover mb-4"
                />
                <Dialog.Title className="text-xl font-bold mb-2">{selectedEvent.title}</Dialog.Title>
                <p className="text-gray-700">{selectedEvent.description}</p>
                <button
                  onClick={closeModal}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Tutup
                </button>
              </>
            )}
          </div>
        </div>
      </Dialog>
    </section>
  );
};

export default EventsSection;