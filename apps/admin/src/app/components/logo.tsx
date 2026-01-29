'use client';

import { APP_CONFIG } from '@/config/app-config';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  src?: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  url?: string;
  withText?: boolean;
  className?: string;
  showTitle?: boolean;
}

export function Logo({
  src = '/images/logo.png',
  alt = APP_CONFIG.name,
  title = APP_CONFIG.name,
  width = 32,
  height = 32,
  url = '/',
  withText = true,
  className,
  showTitle = false,
}: LogoProps) {
  return (
    <Link href={url} className="group flex items-center gap-2.5 outline-none">
      <motion.div
        whileHover={{ scale: 1.05, rotate: -5 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className="relative flex items-center justify-center overflow-hidden rounded-lg shadow-sm ring-1 ring-neutral-200 transition-all group-hover:shadow-md dark:ring-neutral-800"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          priority
        />
      </motion.div>

      {(withText || showTitle) && (
        <span className="group-hover:text-primary text-xl font-bold tracking-tight text-neutral-900 transition-colors dark:text-white">
          {title}
        </span>
      )}
    </Link>
  );
}
