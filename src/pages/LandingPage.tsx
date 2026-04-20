import { motion } from 'framer-motion';
import { Button } from '../components/ui';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-8 overflow-hidden relative">
      {/* Aurora Background Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/20 blur-[100px] rounded-full -z-10 animate-pulse" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 max-w-2xl"
      >
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
          Master Your Learning with <span className="gemini-text-gradient">Lumina</span>
        </h1>
        <p className="text-xl text-slate-500 font-light">
          A premium Room-based RAG application for students and researchers. 
          Upload your materials, talk to your documents, and learn faster.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-4"
      >
        <Button variant="gradient" size="lg" onClick={() => navigate('/register')}>
          Start Learning Free
        </Button>
        <Button variant="secondary" size="lg" onClick={() => navigate('/login')}>
          Sign In
        </Button>
      </motion.div>
    </div>
  );
};

export default LandingPage;
