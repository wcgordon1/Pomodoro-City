import Link from 'next/link';
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';


export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 bg-transparent">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-white text-xl font-bold"><h1>pomodoro timer</h1></div>
        <div className="flex space-x-4">
          <Link href="https://twitter.com/your_twitter" target="_blank" rel="noopener noreferrer">
            <FaXTwitter className="text-white h-6 w-6" />
          </Link>
          <Link href="https://linkedin.com/in/your_linkedin" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="text-white h-6 w-6" />
          </Link>
          <Link href="https://github.com/your_github" target="_blank" rel="noopener noreferrer">
            <FaGithub className="text-white h-6 w-6" />
          </Link>
        </div>
      </div>
    </header>
  );
}