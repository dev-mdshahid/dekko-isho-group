import type { AnchorHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'

type Variant =
    | 'base'
    | 'button-primary-bg'
    | 'button-white-bg'
    | 'button-nav-contact'

const variantClass: Record<Variant, string> = {
    base: 'primary-button button-no-icon w-inline-block',
    'button-primary-bg':
        'primary-button button-no-icon w-variant-5ae0b7d1-2e18-9989-4375-c73c98041680 w-inline-block',
    'button-white-bg':
        'primary-button button-no-icon w-variant-e5ebfb29-ba2d-88c3-9b4e-1bbc038e3a15 w-inline-block',
    'button-nav-contact':
        'primary-button button-no-icon nav-contact-button w-inline-block',
}

type Props = {
    to: string
    label: string
    variant?: Variant
    className?: string
}

export function Button({
    to,
    label,
    variant = 'base',
    className,
}: Props) {
    const classes = className
        ? `${className} button-no-icon`
        : variantClass[variant]

    const inner = (
        <div className="button-primary-inner button-primary-inner--no-icon">
            <div className="button-text-wrap button-text-wrap--no-icon">
                <div className="button-text-inner">
                    <div className="button-text">
                        {label}
                    </div>

                    <div className="button-hover-text">
                        {label}
                    </div>
                </div>
            </div>
        </div>
    )

    const isFileLink =
        to.startsWith('http') ||
        to.startsWith('/docs/') ||
        to.startsWith('/documents/') ||
        /\.(pdf|zip|docx?)$/i.test(to)

    if (isFileLink) {
        const anchorProps: AnchorHTMLAttributes<HTMLAnchorElement> = {
            href: to,
            className: classes,
            ...(to.startsWith('http') ||
                /\.pdf$/i.test(to)
                ? {
                    target: '_blank',
                    rel: 'noreferrer',
                }
                : {}),
        }

        return (
            <a {...anchorProps}>
                {inner}
            </a>
        )
    }

    if (to.startsWith('#')) {
        return (
            <a
                href={to}
                className={classes}
            >
                {inner}
            </a>
        )
    }

    return (
        <Link
            to={to}
            className={classes}
        >
            {inner}
        </Link>
    )
}