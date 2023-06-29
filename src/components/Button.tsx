import Link, { LinkProps } from 'next/link'
import { PropsWithChildren } from 'react'
import styles from './Button.module.scss'

type BaseProps = {
  className?: string
  styleType?: 'pink' | 'black'
}

type ButtonAsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    as?: 'button'
  }
type ButtonAsLink = BaseProps &
  Omit<LinkProps, keyof BaseProps> & {
    as: 'link'
  }
type ButtonAsExternal = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    as: 'externalLink'
  }
type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsExternal

export default function Button(props: PropsWithChildren<ButtonProps>) {
  const allClassNames = `${styles.baseButton} ${
    props.styleType === 'black' ? styles.black : styles.pink
  } ${props.className || ''}`

  if (props.as === 'link') {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { as, styleType, ...rest } = props
    return (
      <Link {...rest}>
        <a target="_blank" rel="noopener noreferrer" className={allClassNames}>
          {props.children}
        </a>
      </Link>
    )
  }

  if (props.as === 'externalLink') {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { as, styleType, ...rest } = props
    return (
      <a target="_blank" {...rest} className={allClassNames}>
        {props.children}
      </a>
    )
  }

  return (
    <button {...props} className={allClassNames}>
      {props.children}
    </button>
  )
}
