import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const particles = [
  { left: '10%', size: 20, duration: 15, delay: 0 },
  { left: '20%', size: 14, duration: 18, delay: 2 },
  { left: '35%', size: 18, duration: 12, delay: 4 },
  { left: '50%', size: 12, duration: 20, delay: 1 },
  { left: '65%', size: 22, duration: 14, delay: 3 },
  { left: '80%', size: 16, duration: 16, delay: 5 },
  { left: '90%', size: 10, duration: 19, delay: 0 },
  { left: '5%', size: 24, duration: 13, delay: 6 },
  { left: '45%', size: 15, duration: 17, delay: 2 },
  { left: '75%', size: 19, duration: 11, delay: 4 },
];

const bokehLights = [
  { className: 'top-[-100px] right-[-100px] h-[300px] w-[300px] bg-white/15' },
  { className: 'bottom-[20%] left-[-50px] h-[200px] w-[200px] bg-[#FFD6E8]/15' },
  { className: 'top-[40%] right-[10%] h-[150px] w-[150px] bg-[#FFADD1]/15' },
];

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/discover');
    }
  }, [navigate]);

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[linear-gradient(180deg,#FF4081_0%,#E91E63_40%,#9C27B0_100%)]">
      <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
        {particles.map((particle, index) => (
          <motion.div
            key={index}
            className="absolute text-white/30"
            style={{
              left: particle.left,
              fontSize: particle.size,
              textShadow: '0 0 12px rgba(255,255,255,0.2)',
            }}
            initial={{ y: '100vh', opacity: 0, rotate: 0 }}
            animate={{
              y: '-100px',
              opacity: [0, 0.3, 0.3, 0],
              rotate: 360,
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            ♥
          </motion.div>
        ))}
      </div>

      {bokehLights.map((light) => (
        <div
          key={light.className}
          className={`pointer-events-none fixed z-[1] rounded-full blur-[40px] ${light.className}`}
        />
      ))}

      <motion.main
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
        className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col items-center justify-between px-6"
        style={{
          paddingTop: 'max(60px, calc(env(safe-area-inset-top) + 40px))',
          paddingBottom: 'max(40px, calc(env(safe-area-inset-bottom) + 20px))',
        }}
      >
        <div className="mt-10 flex flex-col items-center">
          <motion.div
            className="relative mb-6 h-20 w-20"
            animate={{
              filter: [
                'drop-shadow(0 0 20px rgba(255,255,255,0.3))',
                'drop-shadow(0 0 30px rgba(255,255,255,0.5))',
                'drop-shadow(0 0 20px rgba(255,255,255,0.3))',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="absolute left-1/2 top-[26px] h-10 w-10 -translate-x-1/2 rotate-45 rounded-[12px] bg-white" />
            <div className="absolute left-[10px] top-[10px] h-10 w-10 rounded-full bg-white" />
            <div className="absolute right-[10px] top-[10px] h-10 w-10 rounded-full bg-white" />
          </motion.div>
          <div className="text-[32px] font-bold tracking-[0.05em] text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.1)]">
            心动
          </div>
        </div>

        <div className="relative my-8 flex w-full max-w-[280px] flex-1 items-center justify-center">
          <div className="relative aspect-square w-full">
            <div className="absolute bottom-[18%] left-[10%] h-[132px] w-[92px] opacity-60">
              <div className="absolute left-1/2 top-0 h-7 w-7 -translate-x-1/2 rounded-full bg-white/45 blur-[1px]" />
              <div
                className="absolute bottom-0 left-1/2 h-[108px] w-[78px] -translate-x-1/2 rounded-t-[44px] bg-[linear-gradient(to_top,rgba(255,255,255,0.75)_0%,rgba(255,255,255,0.05)_100%)]"
                style={{ clipPath: 'ellipse(42% 50% at 50% 50%)' }}
              />
            </div>

            <div className="absolute bottom-[18%] right-[10%] h-[132px] w-[92px] opacity-60">
              <div className="absolute left-1/2 top-0 h-7 w-7 -translate-x-1/2 rounded-full bg-white/45 blur-[1px]" />
              <div
                className="absolute bottom-0 left-1/2 h-[108px] w-[78px] -translate-x-1/2 rounded-t-[44px] bg-[linear-gradient(to_top,rgba(255,255,255,0.75)_0%,rgba(255,255,255,0.05)_100%)]"
                style={{ clipPath: 'ellipse(42% 50% at 50% 50%)' }}
              />
            </div>

            <motion.div
              className="absolute left-1/2 top-[28%] -translate-x-1/2 text-[60px] leading-none text-white/80 [filter:drop-shadow(0_0_15px_rgba(255,255,255,0.5))]"
              animate={{ scale: [1, 1.1, 1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              ♥
            </motion.div>
          </div>
        </div>

        <div className="mb-8 text-center">
          <h1 className="mb-3 text-[28px] font-bold leading-[1.3] text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.1)]">
            遇见心动的人
          </h1>
          <p className="text-base leading-[1.5] text-white/80">真实的相亲交友平台</p>
        </div>

        <div className="mb-6 flex w-full flex-col gap-4">
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/register')}
            className="flex h-12 w-full items-center justify-center rounded-2xl bg-white text-base font-semibold text-[#FF4081] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] transition-all"
          >
            立即注册
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.16)' }}
            onClick={() => navigate('/login')}
            className="flex h-12 w-full items-center justify-center rounded-2xl border border-white/40 bg-transparent text-base font-semibold text-white transition-all"
          >
            已有账号？登录
          </motion.button>
        </div>

        <p className="text-center text-xs leading-[1.5] text-white/60">
          注册即代表同意
          <a href="#" className="text-white/80 underline underline-offset-2">
            《用户协议》
          </a>
          和
          <a href="#" className="text-white/80 underline underline-offset-2">
            《隐私政策》
          </a>
        </p>
      </motion.main>
    </div>
  );
}
