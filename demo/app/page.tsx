"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const IMAGE_SIZE = 64;

export default function Home() {
  const [count, setCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("count");
    if (stored) setCount(parseInt(stored, 10));
  }, []);

  useEffect(() => {
    localStorage.setItem("count", count.toString());
  }, [count]);

  useEffect(() => {
    if (count !== 0 && count % 100 === 0) {
      setShowModal(true);
    }
  }, [count]);

  const handleClick = () => {
    setCount((prev) => prev + 1);
  };

  const closeModal = () => setShowModal(false);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-base-200 px-4">
      <div>
        <button
          className="btn btn-soft btn-secondary no-underline ml-2"
          onClick={handleClick}
        >
          <span className="ml-2">Counter: {count}</span>
        </button>
      </div>

      {/* DaisyUI Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Wow! So many clicks!!!!</h3>
              <div className="modal-action">
                <button className="btn btn-primary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
