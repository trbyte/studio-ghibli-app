import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
  useMotionValue,
} from "framer-motion";



export const HeroParallax = ({
  products,
  scrollYProgress,
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  
  // Always create all transforms and springs unconditionally - this follows React hooks rules
  const rotateXDesktop = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacityDesktop = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZDesktop = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateYDesktop = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );
  
  const rotateXMobile = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [5, 0]),
    springConfig
  );
  const opacityMobile = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.3, 1]),
    springConfig
  );
  const rotateZMobile = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [5, 0]),
    springConfig
  );
  const translateYMobile = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-100, 100]),
    springConfig
  );
  
  // Detect screen size for responsive transforms
  const [isDesktop, setIsDesktop] = React.useState(false);
  
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768); // md breakpoint
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  // Conditionally select which transforms to use (this is fine - we're selecting values, not calling hooks)
  const rotateX = isDesktop ? rotateXDesktop : rotateXMobile;
  const opacity = isDesktop ? opacityDesktop : opacityMobile;
  const rotateZ = isDesktop ? rotateZDesktop : rotateZMobile;
  const translateY = isDesktop ? translateYDesktop : translateYMobile;
  
  // Fade out parallax cards very early - completely gone before carousel reaches center
  // Fades from 0 to 0.1 scroll progress
  const parallaxOpacity = useSpring(
    useTransform(scrollYProgress, [0, 0.1], [1, 0]),
    springConfig
  );
  
  // Disable pointer events when opacity is very low so carousel can be interacted with
  const [pointerEventsEnabled, setPointerEventsEnabled] = React.useState(true);
  
  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Disable pointer events when parallax is mostly faded
      setPointerEventsEnabled(latest < 0.08);
    });
    
    return () => unsubscribe();
  }, [scrollYProgress]);
  
  return (
    <motion.div
      style={{ 
        opacity: parallaxOpacity,
        pointerEvents: pointerEventsEnabled ? 'auto' : 'none',
      }}
      className="absolute inset-0 overflow-visible md:overflow-hidden antialiased flex flex-col items-center justify-center md:items-start md:justify-start [perspective:1000px] [transform-style:preserve-3d] z-[5]"
    >
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        initial={{ opacity: 0, y: 100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.25, 0.1, 0.25, 1],
          staggerChildren: 0.1
        }}
        className=""
      >
        <motion.div 
          className="flex flex-row-reverse space-x-reverse space-x-3 sm:space-x-4 md:space-x-20 mb-4 sm:mb-6 md:mb-20 mt-0 sm:mt-10 md:mt-80 justify-center md:justify-start"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div 
          className="flex flex-row mb-4 sm:mb-6 md:mb-20 space-x-3 sm:space-x-4 md:space-x-20 justify-center md:justify-start"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div 
          className="flex flex-row-reverse space-x-reverse space-x-3 sm:space-x-4 md:space-x-20 justify-center md:justify-start"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full  left-0 top-0">
      <h1 className="text-2xl md:text-7xl font-bold dark:text-white">
        The Ultimate <br /> development studio
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 dark:text-neutral-200">
        We build beautiful products with the latest technologies and frameworks.
        We are a team of passionate developers and designers that love to build
        amazing products.
      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}) => {
  const handleClick = () => {
    if (product.link && product.link.startsWith('#')) {
      const element = document.querySelector(product.link);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <motion.div
      style={{
        x: translate,
      }}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.25, 0.1, 0.25, 1]
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-40 sm:h-52 md:h-96 w-[10rem] sm:w-[14rem] md:w-[30rem] relative shrink-0 cursor-pointer"
      onClick={handleClick}
    >
      <div className="block group-hover/product:shadow-2xl">
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-cover object-left-top absolute h-full w-full inset-0 rounded-lg"
          alt={product.title}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
          }}
        />
      </div>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none rounded-lg"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white font-semibold text-lg z-10">
        {product.title}
      </h2>
    </motion.div>
  );
};

