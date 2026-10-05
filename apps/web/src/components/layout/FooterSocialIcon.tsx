type FooterSocialIconProps = {
  name: 'facebook' | 'linkedin' | 'twitter'
  className?: string
}

export function FooterSocialIcon({ name, className = 'footer-social-icon' }: FooterSocialIconProps) {
  if (name === 'facebook') {
    return (
      <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M14.17 3.17v.61c0 .69-.56 1.25-1.25 1.25s-1.25.56-1.25 1.25v1.91h.92c.21 0 .32 0 .41.01.6.08 1.08.56 1.16 1.16.01.09.01.2.01.41s0 .32-.01.41c-.08.6-.56 1.08-1.16 1.16-.09.01-.2.01-.41.01h-.92v5.1c0 .3 0 .44-.02.57-.1.55-.53.98-1.08 1.08-.12.02-.27.02-.56.02s-.44 0-.57-.02c-.55-.1-.98-.53-1.08-1.08-.02-.13-.02-.28-.02-.57v-5.1H7.41c-.21 0-.32 0-.41-.01-.6-.08-1.08-.56-1.16-1.16-.01-.09-.01-.2-.01-.41s0-.32.01-.41c.08-.6.56-1.08 1.16-1.16.09-.01.2-.01.41-.01h.92V6.41c0-2.5 2.03-4.54 4.54-4.54.72 0 1.3.58 1.3 1.3Z"
          fill="#E5E5E5"
        />
      </svg>
    )
  }

  if (name === 'linkedin') {
    return (
      <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M0 1.43C0 .64.66 0 1.47 0h17.06C19.34 0 20 .64 20 1.43v17.14c0 .79-.66 1.43-1.47 1.43H1.47C.66 20 0 19.36 0 18.57V1.43ZM6.18 16.74V7.71H3.18v9.03h3ZM4.68 6.48c1.05 0 1.7-.69 1.7-1.56 0-.89-.65-1.56-1.68-1.56S3 4.03 3 4.92c0 .87.65 1.56 1.66 1.56h.02ZM10.81 16.74v-5.04c0-.27.02-.54.1-.73.22-.54.71-1.1 1.54-1.1 1.09 0 1.52.83 1.52 2.04v4.83h3v-5.18c0-2.77-1.48-4.06-3.45-4.06-1.6 0-2.31.88-2.71 1.49h-.02V7.71H7.81c.04.85 0 9.03 0 9.03h3Z"
          fill="#E5E5E5"
        />
      </svg>
    )
  }

  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        fill="#E5E5E5"
      />
    </svg>
  )
}
