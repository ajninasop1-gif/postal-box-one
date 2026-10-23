import React, { useState } from 'react';

export default function App() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState('inbox');
  const [role, setRole] = useState('customer'); // 'customer' or 'staff'
  const [currentLocation, setCurrentLocation] = useState('Southfield'); // 'Southfield' or 'Belleville'
  
  // Notification Banner State
  const [banner, setBanner] = useState({ show: true, text: `Welcome to Postal Box One - Serving ${currentLocation}, MI Securely!` });

  // Initial Mail & Packages Mock Data (Tagged by Location)
  const [mailItems, setMailItems] = useState([
    {
      id: 'm-101',
      location: 'Southfield',
      pmb: 'PMB 402',
      recipient: 'Elysian Virtual Mail LLC',
      sender: 'Internal Revenue Service (IRS)',
      category: 'tax',
      subject: 'Notice of CP2000 Tax Matching & Adjustments',
      date: 'Oct 23, 2026',
      status: 'new',
      envelopeImage: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?auto=format&fit=crop&w=600&q=80',
      pagesCount: 4,
      summary: 'Official IRS notice regarding tax year 2024 information return discrepancies. Requires review within 30 days.',
      scannedPages: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      id: 'm-102',
      location: 'Southfield',
      pmb: 'PMB 118',
      recipient: 'Grandville Music Group',
      sender: 'State of Michigan LARA',
      category: 'legal',
      subject: 'Annual Corporate Report & Franchise Fee Reminder',
      date: 'Oct 22, 2026',
      status: 'opened',
      envelopeImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
      pagesCount: 2,
      summary: 'State filing deadline notice for domestic profit corporations. Fee due by November 15, 2026.',
      scannedPages: [
        'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      id: 'm-103',
      location: 'Belleville',
      pmb: 'PMB 210',
      recipient: 'Nina Artist',
      sender: 'Chase Business Banking',
      category: 'financial',
      subject: 'Monthly Business Checking Statement & Treasury Update',
      date: 'Oct 21, 2026',
      status: 'new',
      envelopeImage: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?auto=format&fit=crop&w=600&q=80',
      pagesCount: 8,
      summary: 'Monthly financial statement showing ending balance of $42,850.12 across operating accounts.',
      scannedPages: []
    },
    {
      id: 'm-104',
      location: 'Southfield',
      pmb: 'PMB 402',
      recipient: 'Elysian Virtual Mail LLC',
      sender: 'Amazon Fulfillment Center',
      category: 'package',
      subject: 'Priority Box Delivery (USPS Tracking #9400 1110 2005 8921)',
      date: 'Oct 23, 2026',
      status: 'package_arrived',
      envelopeImage: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=600&q=80',
      pagesCount: 0,
      summary: 'Medium corrugated box (12x9x4 in). Weight: 3.4 lbs. Inspected and logged securely.'
    }
  ]);

  // Customer Roster & Form 1583 Status
  const [customers, setCustomers] = useState([
    { id: 'c-1', pmb: 'PMB 402', name: 'Nina Ware / Elysian Virtual Mail', location: 'Southfield', form1583: 'Verified & Complete', idStatus: 'Drivers License & Articles of Org Verified', expDate: '08/2028', ron: 'Completed' },
    { id: 'c-2', pmb: 'PMB 118', name: 'John Ware / Grandville Music Group', location: 'Southfield', form1583: 'Verified & Complete', idStatus: 'Passport Verified', expDate: '01/2030', ron: 'Completed' },
    { id: 'c-3', pmb: 'PMB 210', name: 'Lexi B. / Lexi\'s Buttons', location: 'Belleville', form1583: 'Pending ID Re-Upload', idStatus: 'Utility Bill Rejected by USPS', expDate: 'Expired', ron: 'Pending Appointment' }
  ]);

  // UI Interactive States
  const [selectedMail, setSelectedMail] = useState(null);
  const [viewingPdf, setViewingPdf] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [forwardModal, setForwardModal] = useState(false);
  const [forwardAddress, setForwardAddress] = useState('');
  const [forwardCarrier, setForwardCarrier] = useState('USPS Priority 2-Day');
  
  // Staff Intake Simulation Form
  const [newRecipient, setNewRecipient] = useState('');
  const [newPmb, setNewPmb] = useState('PMB 402');
  const [newSender, setNewSender] = useState('');
  const [newCategory, setNewCategory] = useState('tax');

  // Filter items by current location and active tab
  const filteredMail = mailItems.filter(item => {
    const matchesLocation = item.location === currentLocation;
    const matchesSearch = item.sender.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.pmb.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesLocation || !matchesSearch) return false;

    if (activeTab === 'inbox') return item.status === 'new' || item.status === 'opened';
    if (activeTab === 'packages') return item.category === 'package';
    if (activeTab === 'opened') return item.status === 'opened';
    if (activeTab === 'forwarding') return item.status === 'forwarding';
    if (activeTab === 'shred') return item.status === 'shredded';
    if (activeTab === 'archived') return item.status === 'archived';
    return true;
  });

  // Action Handlers
  const handleOpenAndScan = (id) => {
    setMailItems(mailItems.map(item => item.id === id ? { ...item, status: 'opened', scannedPages: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'] } : item));
    alert("Open & Scan Request transmitted to " + currentLocation + " mailroom! Staff will scan within 2 business hours.");
  };

  const handleForwardSubmit = (e) => {
    e.preventDefault();
    if (!forwardAddress) return;
    alert(`Forwarding request confirmed via ${forwardCarrier} to: ${forwardAddress}. Postage charged to account.`);
    setForwardModal(false);
    setForwardAddress('');
  };

  const handleShred = (id) => {
    if (confirm("Are you sure you want to request NAID AAA secure shredding for this item?")) {
      setMailItems(mailItems.map(item => item.id === id ? { ...item, status: 'shredded' } : item));
    }
  };

  const handleStaffIntake = (e) => {
    e.preventDefault();
    if (!newRecipient || !newSender) return;
    const newItem = {
      id: 'm-' + Date.now(),
      location: currentLocation,
      pmb: newPmb,
      recipient: newRecipient,
      sender: newSender,
      category: newCategory,
      subject: `New ${newCategory.toUpperCase()} Item Received at Counter`,
      date: 'Just Now',
      status: 'new',
      envelopeImage: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?auto=format&fit=crop&w=600&q=80',
      pagesCount: 3,
      summary: 'Logged securely by staff via Mobile Mailroom Cam.',
      scannedPages: []
    };
    setMailItems([newItem, ...mailItems]);
    setNewRecipient('');
    setNewSender('');
    alert(`Successfully logged new mail item for ${newPmb} at ${currentLocation} Storefront!`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      
      {/* Top Banner & Location Bar */}
      {banner.show && (
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-800 text-white px-4 py-2 text-xs md:text-sm flex justify-between items-center shadow-inner">
          <div className="flex items-center gap-2 font-medium">
            <span>🏢</span>
            <span>{banner.text}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline bg-blue-900/80 px-2.5 py-1 rounded-full text-xs font-semibold border border-blue-400/30">
              Mail Center One Hub: <strong>{currentLocation} Storefront</strong>
            </span>
            <button 
              onClick={() => setBanner({ ...banner, show: false })}
              className="text-white/80 hover:text-white font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main App Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center text-white text-xl">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">Postal Box One</h1>
              <span className="bg-blue-500/10 text-blue-400 text-xs font-semibold px-2 py-0.5 rounded border border-blue-500/20">
                Powered by Mail Center One
              </span>
            </div>
            <p className="text-xs text-slate-400">Secure Digital Mailbox & CMRA Operations Platform</p>
          </div>
        </div>

        {/* Location & Role Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-700 flex items-center text-xs">
            <button 
              onClick={() => setCurrentLocation('Southfield')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${currentLocation === 'Southfield' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              📍 Southfield Hub
            </button>
            <button 
              onClick={() => setCurrentLocation('Belleville')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${currentLocation === 'Belleville' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              📍 Belleville Hub
            </button>
          </div>

          <div className="bg-slate-900 p-1 rounded-xl border border-slate-700 flex items-center text-xs">
            <button 
              onClick={() => setRole('customer')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${role === 'customer' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              👤 Customer Portal
            </button>
            <button 
              onClick={() => setRole('staff')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${role === 'staff' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              🛠️ Staff Mailroom
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-slate-950/60 border-r border-slate-800 p-4 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
                {role === 'customer' ? 'Mail Management' : 'Staff Operations'}
              </p>
              
              {role === 'customer' ? (
                <nav className="space-y-1">
                  <button 
                    onClick={() => setActiveTab('inbox')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'inbox' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800/60'}`}
                  >
                    <div className="flex items-center gap-3"><span>📥</span> Inbox & Envelopes</div>
                    <span className="bg-slate-800 text-blue-400 text-xs px-2 py-0.5 rounded-full font-bold">
                      {mailItems.filter(i => i.location === currentLocation && (i.status === 'new' || i.status === 'opened')).length}
                    </span>
                  </button>

                  <button 
                    onClick={() => setActiveTab('packages')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'packages' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800/60'}`}
                  >
                    <div className="flex items-center gap-3"><span>📦</span> Packages & Boxes</div>
                    <span className="bg-slate-800 text-amber-400 text-xs px-2 py-0.5 rounded-full font-bold">
                      {mailItems.filter(i => i.location === currentLocation && i.category === 'package').length}
                    </span>
                  </button>

                  <button 
                    onClick={() => setActiveTab('opened')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'opened' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800/60'}`}
                  >
                    <div className="flex items-center gap-3"><span>📂</span> Opened & Scanned</div>
                  </button>

                  <button 
                    onClick={() => setActiveTab('forwarding')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'forwarding' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800/60'}`}
                  >
                    <div className="flex items-center gap-3"><span>✈️</span> Forward Queue</div>
                  </button>

                  <button 
                    onClick={() => setActiveTab('shred')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'shred' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800/60'}`}
                  >
                    <div className="flex items-center gap-3"><span>🗑️</span> Shred Queue</div>
                  </button>
                </nav>
              ) : (
                <nav className="space-y-1">
                  <button 
                    onClick={() => setActiveTab('staff_intake')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'staff_intake' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800/60'}`}
                  >
                    <span>➕</span> Log New Mail / Package
                  </button>
                  <button 
                    onClick={() => setActiveTab('staff_customers')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'staff_customers' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800/60'}`}
                  >
                    <span>📋</span> PMB & Form 1583 Audit
                  </button>
                </nav>
              )}
            </div>
          </div>

          {/* Storefront Info Footer */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl mt-6 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-white">
              <span>📍</span>
              <span>{currentLocation} Storefront</span>
            </div>
            <p className="leading-relaxed">
              {currentLocation === 'Southfield' ? '24901 Northwestern Hwy, Southfield, MI 48075' : '451 S. Huron River Dr, Belleville, MI 48111'}
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-emerald-400 font-medium">
              <span>● Secure CMRA Active</span>
              <span>USPS Compliant</span>
            </div>
          </div>
        </aside>

        {/* Central Dashboard & Workspace */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          
          {/* Header Controls & Search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white capitalize">
                {role === 'customer' ? `${activeTab} Mail` : (activeTab === 'staff_intake' ? 'Staff Mailroom Intake' : 'PMB & Form 1583 Compliance')}
              </h2>
              <p className="text-sm text-slate-400">
                {role === 'customer' 
                  ? `Showing items for ${currentLocation} digital mailbox` 
                  : `Counter operations and compliance for ${currentLocation} location`}
              </p>
            </div>

            {role === 'customer' && (
              <div className="relative w-full md:w-72">
                <input 
                  type="text" 
                  placeholder="🔍 Search sender, PMB, or subject..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>

          {/* VIEW 1: STAFF INTAKE MODE */}
          {role === 'staff' && activeTab === 'staff_intake' && (
            <div className="max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="bg-amber-500/20 p-2.5 rounded-xl text-amber-400 text-lg">
                  ➕
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Log Incoming Mail Item ({currentLocation})</h3>
                  <p className="text-xs text-slate-400">Snap a photo or log envelope metadata for instant customer notification.</p>
                </div>
              </div>

              <form onSubmit={handleStaffIntake} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Customer PMB Box #</label>
                    <select 
                      value={newPmb} 
                      onChange={(e) => setNewPmb(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
                    >
                      <option value="PMB 402">PMB 402 - Elysian Virtual Mail LLC</option>
                      <option value="PMB 118">PMB 118 - Grandville Music Group</option>
                      <option value="PMB 210">PMB 210 - Lexi's Buttons</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Mail Category</label>
                    <select 
                      value={newCategory} 
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
                    >
                      <option value="tax">Tax / Government Notice</option>
                      <option value="legal">Legal Document</option>
                      <option value="financial">Bank / Financial Statement</option>
                      <option value="package">Package / Box Delivery</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Recipient Name / Business</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Elysian Virtual Mail LLC"
                    value={newRecipient}
                    onChange={(e) => setNewRecipient(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-white placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Sender / Return Address</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Internal Revenue Service (IRS)"
                    value={newSender}
                    onChange={(e) => setNewSender(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-white placeholder-slate-500"
                  />
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📷</span>
                    <div>
                      <p className="text-sm font-medium text-white">AI Envelope OCR Auto-Match</p>
                      <p className="text-xs text-slate-400">Gemini Vision will automatically read postage & return address.</p>
                    </div>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                    Ready
                  </span>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold py-3 rounded-xl shadow-lg transition"
                >
                  Log Mail Item & Notify Customer
                </button>
              </form>
            </div>
          )}

          {/* VIEW 2: STAFF CUSTOMER & FORM 1583 AUDIT */}
          {role === 'staff' && activeTab === 'staff_customers' && (
            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">USPS Form 1583 & ID Compliance Roster</h3>
                    <p className="text-xs text-slate-400">Manage CMRA signups, Photo IDs, and Remote Online Notarization for {currentLocation}.</p>
                  </div>
                  <span className="bg-blue-600/20 text-blue-400 text-xs font-medium px-3 py-1 rounded-full border border-blue-500/30">
                    3 Active PMBs Loaded
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-900 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3">Box #</th>
                        <th className="p-3">Client / Business Name</th>
                        <th className="p-3">Form 1583 Status</th>
                        <th className="p-3">ID Verification</th>
                        <th className="p-3">RON Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {customers.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-900/50 transition">
                          <td className="p-3 font-bold text-blue-400">{c.pmb}</td>
                          <td className="p-3 font-medium text-white">{c.name}</td>
                          <td className="p-3">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.form1583.includes('Complete') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                              {c.form1583}
                            </span>
                          </td>
                          <td className="p-3 text-xs text-slate-300">{c.idStatus}</td>
                          <td className="p-3 text-xs font-medium text-slate-300">{c.ron}</td>
                          <td className="p-3 text-right">
                            <button 
                              onClick={() => alert(`Opening verification file for ${c.name}`)}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                            >
                              Audit Files
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: CUSTOMER MAILBOX GRID */}
          {role === 'customer' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMail.length === 0 ? (
                <div className="col-span-full py-16 text-center bg-slate-950/40 border border-slate-800/80 rounded-2xl">
                  <div className="text-4xl mb-3">📭</div>
                  <h3 className="text-lg font-semibold text-slate-300">No mail items found</h3>
                  <p className="text-xs text-slate-500 mt-1">Your mailbox for {currentLocation} is completely up to date.</p>
                </div>
              ) : (
                filteredMail.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 transition flex flex-col justify-between"
                  >
                    <div>
                      {/* Envelope Photo Preview */}
                      <div className="relative h-44 bg-slate-900 overflow-hidden border-b border-slate-800">
                        <img 
                          src={item.envelopeImage} 
                          alt="Envelope scan"
                          className="w-full h-full object-cover opacity-90 hover:scale-105 transition duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-400 border border-slate-700">
                          {item.pmb}
                        </div>
                        <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 border border-slate-700">
                          {item.date}
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="p-5 space-y-3">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                            {item.category}
                          </span>
                          <h3 className="text-base font-semibold text-white mt-2 leading-snug">{item.subject}</h3>
                          <p className="text-xs text-slate-400 mt-1">From: <strong className="text-slate-300">{item.sender}</strong></p>
                        </div>

                        <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-4 bg-slate-900/40 border-t border-slate-800/80 grid grid-cols-2 gap-2">
                      {item.status === 'new' && (
                        <button 
                          onClick={() => handleOpenAndScan(item.id)}
                          className="col-span-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow transition"
                        >
                          👁️ Request Open & Scan
                        </button>
                      )}

                      {item.status === 'opened' && (
                        <button 
                          onClick={() => setViewingPdf(item)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                        >
                          📄 View Scans ({item.pagesCount}p)
                        </button>
                      )}

                      <button 
                        onClick={() => setForwardModal(true)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        ✈️ Forward
                      </button>

                      <button 
                        onClick={() => handleShred(item.id)}
                        className="bg-slate-800 hover:bg-slate-700 text-red-400 font-medium py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        🗑️ Shred
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </main>
      </div>

      {/* PDF VIEWER MODAL */}
      {viewingPdf && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">{viewingPdf.subject}</h3>
                <p className="text-xs text-slate-400">Secure Document Viewer • {viewingPdf.sender}</p>
              </div>
              <button 
                onClick={() => setViewingPdf(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 bg-slate-900/50 flex-1">
              <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-xl flex items-center gap-3">
                <span className="text-xl">🛡️</span>
                <p className="text-xs text-blue-200 leading-relaxed">
                  <strong>AI Executive Summary:</strong> {viewingPdf.summary}
                </p>
              </div>

              {viewingPdf.scannedPages.length > 0 ? (
                viewingPdf.scannedPages.map((pageUrl, idx) => (
                  <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-700">
                    <div className="bg-slate-100 text-slate-700 px-4 py-2 text-xs font-bold border-b border-slate-200 flex justify-between">
                      <span>Page {idx + 1} of {viewingPdf.pagesCount}</span>
                      <span>Verified Digital Scan</span>
                    </div>
                    <img src={pageUrl} alt={`Document page ${idx + 1}`} className="w-full object-contain max-h-[500px]" />
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <p>Scan in progress by {currentLocation} mailroom staff...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FORWARDING MODAL */}
      {forwardModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">Schedule Mail Forwarding</h3>
              <button onClick={() => setForwardModal(false)} className="text-slate-400 hover:text-white font-bold">×</button>
            </div>
            <form onSubmit={handleForwardSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Destination Mailing Address</label>
                <textarea 
                  rows="3"
                  placeholder="Enter full street address, city, state, zip"
                  value={forwardAddress}
                  onChange={(e) => setForwardAddress(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Carrier Speed</label>
                <select 
                  value={forwardCarrier} 
                  onChange={(e) => setForwardCarrier(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm text-white"
                >
                  <option value="USPS Priority 2-Day">USPS Priority Mail (2-3 Days)</option>
                  <option value="FedEx Express Saver">FedEx Express Saver (3-Day)</option>
                  <option value="USPS First Class Bundle">USPS First Class Mail Bundle</option>
                </select>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl shadow transition"
                >
                  Confirm Forwarding & Calculate Postage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}