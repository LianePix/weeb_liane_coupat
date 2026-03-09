import { motion } from "framer-motion";

export default function AnimatedSquare() {
  return (
    <motion.div
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop",}}
      className="hidden sm:block sm:w-[200px] md:w-[500px] h-auto mr-10"
    >
      <img
        src="/images/Shapes.webp"
        alt="Animated Square"
      />
    </motion.div>
  );
}
