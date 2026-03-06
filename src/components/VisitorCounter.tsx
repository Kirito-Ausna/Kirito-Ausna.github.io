import { useEffect } from 'react'

const BUSUANZI_SRC = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
const SCRIPT_ID = 'busuanzi-script'

export default function VisitorCounter() {
  useEffect(() => {
    if (document.getElementById(SCRIPT_ID)) return
    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.async = true
    script.src = BUSUANZI_SRC
    document.body.appendChild(script)
  }, [])

  return (
    <div className="text-center text-[13px] leading-6 text-zinc-500">
      <span id="busuanzi_container_site_uv" className="mr-4" style={{ display: 'none' }}>
        Visitors <span id="busuanzi_value_site_uv" />
      </span>
      <span id="busuanzi_container_site_pv" style={{ display: 'none' }}>
        Total Visits <span id="busuanzi_value_site_pv" />
      </span>
    </div>
  )
}
