export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[#e5e7eb] bg-white px-6 lg:px-8 py-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
        <span>© {year} NA Dev Studio. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <a href="https://nadevstudio.com/privacy-policy" className="hover:text-[#6366f1] transition-colors">
            Privacy
          </a>
          <a href="https://nadevstudio.com/contact" className="hover:text-[#6366f1] transition-colors">
            Support
          </a>
          <span className="text-gray-400">v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}
