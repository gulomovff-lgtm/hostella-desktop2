import React from 'react';
import RoomCardChess from '../rooms/RoomCardChess';

/**
 * Rooms View Component
 * Displays room grid in chess-style layout
 */
const RoomsView = ({ rooms, onRoomClick, onAddRoom }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Комнаты</h2>
        <button
          onClick={onAddRoom}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
        >
          + Добавить комнату
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {rooms.map(room => (
          <RoomCardChess
            key={room.id}
            room={room}
            onClick={() => onRoomClick(room)}
          />
        ))}
      </div>
    </div>
  );
};

export { RoomsView };
export default RoomsView;
