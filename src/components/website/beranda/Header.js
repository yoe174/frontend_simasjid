// // // src/components/Header.js
// // import { Bell, User, Search } from "lucide-react";

// // export default function Header() {
// //   return (
// //     <header className="bg-green-700 text-white px-6 py-3 flex justify-between items-center shadow">
// //       {/* Left - Page Info */}
// //       <div className="text-sm">
// //         <span className="opacity-80">Pages</span>
// //         <span className="mx-1">/</span>
// //         <span className="font-semibold">Dashboard</span>
// //       </div>

// //       {/* Right - Search & Icons */}
// //       <div className="flex items-center gap-4">
// //         {/* Search Bar */}
// //         <div className="flex items-center bg-white rounded px-2 py-1 text-gray-700">
// //           <Search size={16} className="mr-2 text-gray-500" />
// //           <input
// //             type="text"
// //             placeholder="Cari"
// //             className="outline-none bg-transparent text-sm"
// //           />
// //         </div>

// //         {/* Icons */}
// //         <User className="cursor-pointer" />
// //         <Bell className="cursor-pointer" />
// //       </div>
// //     </header>
// //   );
// // }

// // src/components/Header.js
// export default function Header() {
//   return (
//     <header style={{
//       backgroundColor: '#0b774a',
//       color: 'white',
//       padding: '12px 24px',
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center'
//     }}>
//       {/* Kiri */}
//       <div style={{ fontSize: '14px' }}>
//         {/* <span style={{ opacity: 0.8 }}>Pages</span>
//         <span style={{ margin: '0 4px' }}>/</span>
//         <span style={{ fontWeight: 'bold' }}>Dashboard</span> */}
//       </div>

//       {/* Kanan */}
//       <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//         {/* Search */}
//         <div style={{
//           display: 'flex',
//           alignItems: 'center',
//           backgroundColor: 'white',
//           padding: '4px 8px',
//           borderRadius: '6px',
//           color: 'gray'
//         }}>
//           🔍
//           <input
//             type="text"
//             placeholder="Cari"
//             style={{
//               border: 'none',
//               outline: 'none',
//               marginLeft: '8px',
//               fontSize: '14px'
//             }}
//           />
//         </div>

//         {/* Icons */}
//         <span>👤</span>
//         <span>🔔</span>
//       </div>
//     </header>
//   );
// }
