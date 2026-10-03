import { useRef, useState, type ReactNode } from 'react'
import { EditorContent, useEditor, useEditorState, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Underline as UnderlineIcon,
  Undo2,
  Unlink,
} from 'lucide-react'
import { api } from '../lib/api'
import { useUi } from './ui'

type Props = {
  initialHtml: string
  initialJson?: unknown
  jobId?: string
  onChange: (html: string, json: unknown) => void
  placeholder?: string
  readOnly?: boolean
}

export function RichTextEditor({ initialHtml, initialJson, jobId, onChange, placeholder = 'Describe the role, responsibilities and what you’re looking for…', readOnly = false }: Props) {
  const editor = useEditor({
    editable: !readOnly,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false, autolink: true, defaultProtocol: 'https' } }),
      Image.configure({ allowBase64: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: (initialJson as object | undefined) ?? initialHtml,
    editorProps: { attributes: { class: 'prose', 'aria-label': 'Role description' } },
    onUpdate: ({ editor: e }) => onChange(e.isEmpty ? '' : e.getHTML(), e.getJSON()),
  })

  return (
    <div className="editor">
      {editor && !readOnly ? <Toolbar editor={editor} jobId={jobId} /> : null}
      <EditorContent editor={editor} />
    </div>
  )
}

function B({ on, label, onClick, disabled, children }: { on?: boolean; label: string; onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <button type="button" className={`tb ${on ? 'on' : ''}`} aria-label={label} title={label} aria-pressed={on} disabled={disabled} onMouseDown={(e) => e.preventDefault()} onClick={onClick}>
      {children}
    </button>
  )
}

function Toolbar({ editor, jobId }: { editor: Editor; jobId?: string }) {
  const { toast } = useUi()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      underline: e.isActive('underline'),
      h2: e.isActive('heading', { level: 2 }),
      h3: e.isActive('heading', { level: 3 }),
      bullet: e.isActive('bulletList'),
      ordered: e.isActive('orderedList'),
      quote: e.isActive('blockquote'),
      link: e.isActive('link'),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  })

  const setLink = () => {
    const previous = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Link address', previous ?? 'https://')
    if (url === null) return
    if (!url.trim()) return void editor.chain().focus().extendMarkRange('link').unsetLink().run()
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
  }

  const upload = async (file: File) => {
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      if (jobId) form.append('jobId', jobId)
      const { url } = await api<{ url: string }>('/api/hr/images', { form })
      editor.chain().focus().setImage({ src: url, alt: file.name.replace(/\.[^.]+$/, '') }).run()
    } catch (err) {
      toast((err as Error).message, 'error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="editor-toolbar" role="toolbar" aria-label="Formatting">
      <B label="Heading" on={s.h2} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 size={16} />
      </B>
      <B label="Subheading" on={s.h3} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <Heading3 size={16} />
      </B>
      <span className="sep" />
      <B label="Bold" on={s.bold} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold size={16} />
      </B>
      <B label="Italic" on={s.italic} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic size={16} />
      </B>
      <B label="Underline" on={s.underline} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <UnderlineIcon size={16} />
      </B>
      <span className="sep" />
      <B label="Bulleted list" on={s.bullet} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List size={16} />
      </B>
      <B label="Numbered list" on={s.ordered} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered size={16} />
      </B>
      <B label="Quote" on={s.quote} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote size={16} />
      </B>
      <B label="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus size={16} />
      </B>
      <span className="sep" />
      <B label={s.link ? 'Edit link' : 'Add link'} on={s.link} onClick={setLink}>
        <Link2 size={16} />
      </B>
      {s.link ? (
        <B label="Remove link" onClick={() => editor.chain().focus().unsetLink().run()}>
          <Unlink size={16} />
        </B>
      ) : null}
      <B label="Insert image" disabled={uploading} onClick={() => fileRef.current?.click()}>
        {uploading ? <span className="spinner" /> : <ImagePlus size={16} />}
      </B>
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0]
          e.target.value = ''
          if (f) void upload(f)
        }}
      />
      <span className="sep" />
      <B label="Undo" disabled={!s.canUndo} onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 size={16} />
      </B>
      <B label="Redo" disabled={!s.canRedo} onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 size={16} />
      </B>
    </div>
  )
}
