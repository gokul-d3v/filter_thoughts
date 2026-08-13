export default function Home() {
  return (
    <>
      
{/*  SideNavBar (Desktop)  */}
<aside className="hidden md:flex flex-col p-8 space-y-6 h-[calc(100vh-4rem)] w-24 xl:w-72 fixed left-6 top-8 rounded-3xl border border-soft-clay/50 bg-white/80 backdrop-blur-xl shadow-soft z-40">
<div className="mb-4 flex items-center justify-center xl:justify-start px-2">
<span className="material-symbols-outlined text-deep-olive text-3xl xl:hidden">spa</span>
<h1 className="hidden xl:block font-headline-md text-[24px] text-primary font-bold tracking-tight">Veritas Chat</h1>
</div>
<nav className="flex-1 space-y-3">
<a className="flex items-center justify-center xl:justify-start space-x-0 xl:space-x-4 p-3 xl:px-5 xl:py-3.5 rounded-2xl bg-secondary-container/50 text-deep-olive font-bold font-label-md text-label-md transition-all" href="#">
<span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
<span className="hidden xl:block">Discovery</span>
</a>
<a className="flex items-center justify-center xl:justify-start space-x-0 xl:space-x-4 p-3 xl:px-5 xl:py-3.5 rounded-2xl text-on-surface-variant hover:bg-soft-clay/40 transition-all font-label-md text-label-md hover:text-deep-olive" href="#">
<span className="material-symbols-outlined text-[22px]">chat_bubble</span>
<span className="hidden xl:block">Active Chats</span>
</a>
<a className="flex items-center justify-center xl:justify-start space-x-0 xl:space-x-4 p-3 xl:px-5 xl:py-3.5 rounded-2xl text-on-surface-variant hover:bg-soft-clay/40 transition-all font-label-md text-label-md hover:text-deep-olive" href="#">
<span className="material-symbols-outlined text-[22px]">archive</span>
<span className="hidden xl:block">Archives</span>
</a>
<a className="flex items-center justify-center xl:justify-start space-x-0 xl:space-x-4 p-3 xl:px-5 xl:py-3.5 rounded-2xl text-on-surface-variant hover:bg-soft-clay/40 transition-all font-label-md text-label-md hover:text-deep-olive" href="#">
<span className="material-symbols-outlined text-[22px]">shield</span>
<span className="hidden xl:block">Security</span>
</a>
</nav>
<div className="mt-auto flex flex-col items-center xl:items-stretch">
<button className="w-12 h-12 xl:w-full bg-deep-olive text-ivory-bg xl:py-3.5 xl:px-6 rounded-full font-label-md text-label-md mb-6 hover:bg-muted-sage hover:-translate-y-0.5 hover:shadow-float transition-all duration-300 flex items-center justify-center space-x-0 xl:space-x-2">
<span className="material-symbols-outlined">add</span>
<span className="hidden xl:block font-medium">Start New Chat</span>
</button>
<div className="border-t border-soft-clay/50 pt-6 space-y-3 w-full">
<a className="flex items-center justify-center xl:justify-start space-x-0 xl:space-x-4 p-2 xl:px-5 text-on-surface-variant hover:bg-soft-clay/40 rounded-2xl font-label-md text-label-md transition-all hover:text-deep-olive" href="#">
<span className="material-symbols-outlined text-[20px]">help</span>
<span className="hidden xl:block">Help</span>
</a>
<a className="flex items-center justify-center xl:justify-start space-x-0 xl:space-x-4 p-2 xl:px-5 text-on-surface-variant hover:bg-soft-clay/40 rounded-2xl font-label-md text-label-md transition-all hover:text-deep-olive" href="#">
<span className="material-symbols-outlined text-[20px]">logout</span>
<span className="hidden xl:block">Sign Out</span>
</a>
</div>
<div className="mt-8 flex items-center justify-center xl:justify-start space-x-0 xl:space-x-3 px-2 w-full">
<div className="w-10 h-10 rounded-full bg-surface-variant overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
<img alt="Anonymous Identity" className="w-full h-full object-cover" data-alt="A minimalist, highly abstract profile image representing an anonymous identity." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJP_h74KfS9mvepICnH_ZeNTVzqxvCTfTHkuak5gad-7lWRkosxdpOl7Ombs5wK9Vv5jCrWlEWynG-YNU3SsLyY3HQDKTUTIckm2HF0hKkeFhm4gHl0-tv1nPytMXoWm6i1APCcfuQ8BIDz5tWvkBkUyEpwfOFMFf1xNoIiZApjO0Sk0_1N00ygYCf-8w-hl5IW8xCjSA4BomGgPCY-A4Xboalv1ldN4RGtfMQj0lDc3DBvb6-Aehu"/>
</div>
<div className="hidden xl:block">
<p className="font-label-md text-label-md font-bold text-primary">Anonymous User</p>
<p className="font-label-sm text-label-sm text-muted-sage">Incognito Mode</p>
</div>
</div>
</div>
</aside>
{/*  Main Content Area  */}
<main className="flex-1 md:ml-36 xl:ml-[340px] pb-20 md:pb-0 min-h-screen">
{/*  TopNavBar (Desktop)  */}
<header className="hidden md:flex justify-between items-center max-w-7xl mx-auto px-12 h-24 w-full sticky top-0 z-30 bg-ivory-bg/90 backdrop-blur-md">
<div className="flex items-center space-x-8">
<div className="w-4"></div>
</div>
<nav className="flex space-x-8 bg-white/50 px-8 py-3 rounded-full shadow-soft backdrop-blur-sm border border-soft-clay/20">
<a className="font-body-md text-body-md text-primary font-medium border-b-2 border-deep-olive pb-0.5 transition-opacity" href="#">Discover</a>
<a className="font-body-md text-body-md text-on-surface-variant hover:text-deep-olive transition-colors duration-200" href="#">Rooms</a>
<a className="font-body-md text-body-md text-on-surface-variant hover:text-deep-olive transition-colors duration-200" href="#">Private</a>
</nav>
<div className="flex items-center space-x-6 text-primary">
<div className="relative">
<span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-sage text-sm">search</span>
<input className="pl-11 pr-5 py-2.5 bg-white shadow-soft border-none rounded-full focus:ring-2 focus:ring-muted-sage/30 font-label-md text-label-md w-64 transition-all duration-300 focus:w-72" placeholder="Search network..." type="text"/>
</div>
<button className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center hover:text-deep-olive transition-colors duration-200 hover:-translate-y-0.5">
<span className="material-symbols-outlined text-[20px]">notifications</span>
</button>
<button className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center hover:text-deep-olive transition-colors duration-200 hover:-translate-y-0.5">
<span className="material-symbols-outlined text-[20px]">settings</span>
</button>
</div>
</header>
{/*  TopAppBar (Mobile)  */}
<header className="md:hidden flex items-center justify-between px-6 h-20 sticky top-0 z-50 bg-ivory-bg/90 backdrop-blur-md">
<h1 className="font-headline-lg-mobile text-[28px] font-bold text-primary tracking-tight">Discovery Hub</h1>
<button className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-deep-olive">
<span className="material-symbols-outlined">search</span>
</button>
</header>
{/*  Content Canvas  */}
<div className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-16">
<div className="mb-section-gap max-w-3xl">
<h1 className="hidden md:block font-headline-lg text-headline-lg text-primary mb-6 tracking-tight">Discovery Hub</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant/90 leading-relaxed">Explore active network nodes and secure communication channels. All metrics are anonymized and end-to-end encrypted.</p>
</div>
{/*  Dashboard Grid Layout  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
{/*  Main Content Column  */}
<div className="lg:col-span-8 space-y-12">
{/*  Search/Filter Bar  */}
<div className="bg-white p-3 border-none shadow-soft rounded-2xl flex items-center space-x-4">
<div className="pl-4">
<span className="material-symbols-outlined text-muted-sage">filter_list</span>
</div>
<input className="flex-1 bg-transparent border-none focus:ring-0 font-body-md text-body-md text-primary placeholder-muted-sage/70" placeholder="Filter nodes by topic, encryption level, or activity..." type="text"/>
<button className="bg-deep-olive text-ivory-bg px-6 py-3 rounded-xl font-label-md text-[15px] font-medium hover:bg-muted-sage hover:shadow-float transition-all duration-300">Search</button>
</div>
{/*  Section Header  */}
<div className="flex items-center justify-between pt-6">
<h2 className="font-headline-md text-headline-md text-primary tracking-tight">Trending Nodes</h2>
<span className="font-label-sm text-[11px] text-muted-sage font-bold uppercase tracking-widest bg-soft-clay/30 px-3 py-1 rounded-full">Live Updates</span>
</div>
{/*  Bento Grid for Nodes  */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
{/*  Node Card 1  */}
<div className="bg-white border-none shadow-soft rounded-3xl p-8 hover:shadow-float transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex flex-col h-full">
<div className="flex justify-between items-start mb-6">
<div className="bg-soft-clay/40 px-3 py-1.5 rounded-lg font-label-sm text-[13px] font-medium text-deep-olive">Global Chat</div>
<div className="flex items-center space-x-1.5 text-muted-sage bg-white px-2 py-1 rounded-full border border-soft-clay/30">
<span className="material-symbols-outlined text-[16px]">group</span>
<span className="font-label-md text-[13px] font-medium">1.2k</span>
</div>
</div>
<h3 className="font-body-lg text-[22px] font-bold text-primary mb-3 group-hover:text-deep-olive transition-colors">Project Synthesis</h3>
<p className="font-body-md text-[15px] text-on-surface-variant/80 mb-8 flex-grow leading-relaxed">General discussion forum for distributed systems architecture and secure protocol design.</p>
<div className="flex items-center justify-between border-t border-soft-clay/30 pt-6 mt-auto">
<div className="flex items-center space-x-2.5">
<span className="relative flex h-2.5 w-2.5">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-deep-olive opacity-40"></span>
<span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-deep-olive"></span>
</span>
<span className="font-label-sm text-[13px] font-medium text-muted-sage">High Activity</span>
</div>
<button className="text-deep-olive font-label-md text-[14px] font-semibold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
<span>Join Node</span>
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
</div>
</div>
{/*  Node Card 2  */}
<div className="bg-white border-none shadow-soft rounded-3xl p-8 hover:shadow-float transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex flex-col h-full">
<div className="flex justify-between items-start mb-6">
<div className="bg-soft-clay/40 px-3 py-1.5 rounded-lg font-label-sm text-[13px] font-medium text-deep-olive">Encrypted Room</div>
<div className="flex items-center space-x-1.5 text-muted-sage bg-white px-2 py-1 rounded-full border border-soft-clay/30">
<span className="material-symbols-outlined text-[16px]">group</span>
<span className="font-label-md text-[13px] font-medium">84</span>
</div>
</div>
<h3 className="font-body-lg text-[22px] font-bold text-primary mb-3 group-hover:text-deep-olive transition-colors">Sector 7 Alerts</h3>
<p className="font-body-md text-[15px] text-on-surface-variant/80 mb-8 flex-grow leading-relaxed">Read-only broadcast channel for system-wide security updates and threat intelligence.</p>
<div className="flex items-center justify-between border-t border-soft-clay/30 pt-6 mt-auto">
<div className="flex items-center space-x-2.5">
<span className="w-2.5 h-2.5 rounded-full bg-muted-sage/60"></span>
<span className="font-label-sm text-[13px] font-medium text-muted-sage">Moderate Activity</span>
</div>
<button className="text-deep-olive font-label-md text-[14px] font-semibold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
<span>Request Access</span>
<span className="material-symbols-outlined text-[16px]">lock</span>
</button>
</div>
</div>
{/*  Node Card 3 (Full width in grid)  */}
<div className="md:col-span-2 bg-white border-none shadow-soft rounded-3xl p-8 hover:shadow-float transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex flex-col md:flex-row md:items-center justify-between">
<div className="mb-6 md:mb-0 md:pr-10 md:w-2/3">
<div className="flex items-center space-x-3 mb-4">
<div className="w-10 h-10 rounded-full bg-secondary-container/50 flex items-center justify-center text-deep-olive">
<span className="material-symbols-outlined text-[20px]">star</span>
</div>
<h3 className="font-body-lg text-[24px] font-bold text-primary group-hover:text-deep-olive transition-colors">Design System Review</h3>
</div>
<p className="font-body-md text-[16px] text-on-surface-variant/80 leading-relaxed">Weekly sync for UI/UX alignment. Currently discussing minimal corporate aesthetic implementation.</p>
</div>
<div className="flex items-center justify-between md:flex-col md:items-end space-y-0 md:space-y-6 md:w-1/3 md:border-l md:border-soft-clay/30 md:pl-8">
<div className="flex -space-x-3">
<div className="w-10 h-10 rounded-full bg-soft-clay border-2 border-white flex items-center justify-center font-label-md font-bold text-deep-olive shadow-sm">A</div>
<div className="w-10 h-10 rounded-full bg-surface-variant border-2 border-white flex items-center justify-center font-label-md font-bold text-deep-olive shadow-sm">B</div>
<div className="w-10 h-10 rounded-full bg-muted-sage/20 border-2 border-white flex items-center justify-center font-label-sm font-bold text-deep-olive shadow-sm">+5</div>
</div>
<button className="bg-white border-2 border-deep-olive text-deep-olive px-6 py-2.5 rounded-full font-label-md text-[15px] font-medium hover:bg-deep-olive hover:text-white hover:shadow-float transition-all duration-300 w-full md:w-auto">
                                    Enter Node
                                </button>
</div>
</div>
</div>
</div>
{/*  Sidebar / Network Status Column  */}
<div className="lg:col-span-4 space-y-8 pt-2">
{/*  Network Status Card  */}
<div className="bg-white border-none shadow-soft rounded-3xl p-8">
<h3 className="font-headline-sm text-[20px] font-bold text-primary mb-6">Network Status</h3>
<div className="space-y-5">
<div className="flex items-center justify-between pb-5 border-b border-soft-clay/30">
<div className="flex items-center space-x-4">
<div className="w-10 h-10 rounded-full bg-soft-clay/30 flex items-center justify-center">
<span className="material-symbols-outlined text-muted-sage text-[20px]">router</span>
</div>
<span className="font-label-md text-[15px] font-medium text-primary">Connection</span>
</div>
<span className="font-label-sm text-[12px] font-bold tracking-wider bg-secondary-fixed/50 text-deep-olive px-3 py-1.5 rounded-full">SECURE</span>
</div>
<div className="flex items-center justify-between pb-5 border-b border-soft-clay/30">
<div className="flex items-center space-x-4">
<div className="w-10 h-10 rounded-full bg-soft-clay/30 flex items-center justify-center">
<span className="material-symbols-outlined text-muted-sage text-[20px]">speed</span>
</div>
<span className="font-label-md text-[15px] font-medium text-primary">Latency</span>
</div>
<span className="font-label-md text-[15px] font-bold text-deep-olive">24ms</span>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center space-x-4">
<div className="w-10 h-10 rounded-full bg-soft-clay/30 flex items-center justify-center">
<span className="material-symbols-outlined text-muted-sage text-[20px]">vpn_key</span>
</div>
<span className="font-label-md text-[15px] font-medium text-primary">Protocol</span>
</div>
<span className="font-label-md text-[15px] font-bold text-deep-olive">RSA-4096</span>
</div>
</div>
</div>
{/*  Recommended Connections List  */}
<div className="bg-white border-none shadow-soft rounded-3xl p-8">
<h3 className="font-headline-sm text-[20px] font-bold text-primary mb-6">Suggested Nodes</h3>
<ul className="space-y-1">
<li className="py-4 border-b border-soft-clay/30 last:border-0 hover:bg-soft-clay/10 transition-colors -mx-8 px-8 cursor-pointer flex justify-between items-center group rounded-2xl">
<div>
<p className="font-body-md text-[16px] text-primary font-semibold group-hover:text-deep-olive transition-colors mb-1">DevOps Sync</p>
<p className="font-label-sm text-[13px] text-muted-sage">34 active peers</p>
</div>
<button className="w-8 h-8 rounded-full bg-white shadow-sm border border-soft-clay/20 flex items-center justify-center text-muted-sage group-hover:text-deep-olive group-hover:bg-soft-clay/30 transition-all">
<span className="material-symbols-outlined text-[20px]">add</span>
</button>
</li>
<li className="py-4 border-b border-soft-clay/30 last:border-0 hover:bg-soft-clay/10 transition-colors -mx-8 px-8 cursor-pointer flex justify-between items-center group rounded-2xl">
<div>
<p className="font-body-md text-[16px] text-primary font-semibold group-hover:text-deep-olive transition-colors mb-1">Market Analysis</p>
<p className="font-label-sm text-[13px] text-muted-sage">120 active peers</p>
</div>
<button className="w-8 h-8 rounded-full bg-white shadow-sm border border-soft-clay/20 flex items-center justify-center text-muted-sage group-hover:text-deep-olive group-hover:bg-soft-clay/30 transition-all">
<span className="material-symbols-outlined text-[20px]">add</span>
</button>
</li>
<li className="py-4 border-b border-soft-clay/30 last:border-0 hover:bg-soft-clay/10 transition-colors -mx-8 px-8 cursor-pointer flex justify-between items-center group rounded-2xl">
<div>
<p className="font-body-md text-[16px] text-primary font-semibold group-hover:text-deep-olive transition-colors mb-1">Coffee Break</p>
<p className="font-label-sm text-[13px] text-muted-sage">8 active peers</p>
</div>
<button className="w-8 h-8 rounded-full bg-white shadow-sm border border-soft-clay/20 flex items-center justify-center text-muted-sage group-hover:text-deep-olive group-hover:bg-soft-clay/30 transition-all">
<span className="material-symbols-outlined text-[20px]">add</span>
</button>
</li>
</ul>
</div>
</div>
</div>
</div>
</main>
{/*  BottomNavBar (Mobile)  */}
<nav className="md:hidden flex justify-around items-center px-6 py-4 fixed bottom-0 w-full z-50 bg-white/90 backdrop-blur-xl border-t border-soft-clay/30 pb-safe">
<a className="flex flex-col items-center justify-center text-deep-olive font-medium p-2 rounded-2xl transition-transform duration-200 active:scale-95" href="#">
<div className="bg-secondary-container/50 px-4 py-1 rounded-full mb-1">
<span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
</div>
<span className="font-label-sm text-[11px] font-bold">Discover</span>
</a>
<a className="flex flex-col items-center justify-center text-muted-sage hover:text-deep-olive p-2 rounded-2xl transition-all duration-200 active:scale-95" href="#">
<div className="px-4 py-1 mb-1">
<span className="material-symbols-outlined text-[22px]">chat_bubble</span>
</div>
<span className="font-label-sm text-[11px]">Chat</span>
</a>
<a className="flex flex-col items-center justify-center text-muted-sage hover:text-deep-olive p-2 rounded-2xl transition-all duration-200 active:scale-95" href="#">
<div className="px-4 py-1 mb-1">
<span className="material-symbols-outlined text-[22px]">groups</span>
</div>
<span className="font-label-sm text-[11px]">Rooms</span>
</a>
<a className="flex flex-col items-center justify-center text-muted-sage hover:text-deep-olive p-2 rounded-2xl transition-all duration-200 active:scale-95" href="#">
<div className="px-4 py-1 mb-1">
<span className="material-symbols-outlined text-[22px]">person</span>
</div>
<span className="font-label-sm text-[11px]">Me</span>
</a>
</nav>

    </>
  );
}