import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';

export function SocialButtons() {
  return (
    <div className="flex gap-4">
      <a href="https://twitter.com/parkhub" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition">
        <FaTwitter className="w-5 h-5" />
      </a>
      <a href="https://facebook.com/parkhub" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition">
        <FaFacebook className="w-5 h-5" />
      </a>
      <a href="https://instagram.com/parkhub" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition">
        <FaInstagram className="w-5 h-5" />
      </a>
      <a href="https://linkedin.com/company/parkhub" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition">
        <FaLinkedin className="w-5 h-5" />
      </a>
      <a href="https://github.com/parkhub" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition">
        <FaGithub className="w-5 h-5" />
      </a>
    </div>
  )
}