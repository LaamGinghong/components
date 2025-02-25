import { computed, defineComponent, inject, onBeforeUnmount, onMounted, watch } from 'vue'
import { linkProps } from './types'
import { anchorToken } from './token'

export default defineComponent({
  name: 'IxAnchorLink',
  props: linkProps,
  setup(props, { slots }) {
    const { registerLink, unregisterLink, activeLink, handleLinkClick } = inject(anchorToken)!
    watch(
      () => props.href,
      (newHref, oldHref) => {
        unregisterLink(oldHref)
        registerLink(newHref)
      },
    )
    onMounted(() => registerLink(props.href))
    onBeforeUnmount(() => unregisterLink(props.href))

    const isActive = computed(() => activeLink.value === props.href)
    const classes = computed(() => {
      return {
        'ix-anchor-link-title': true,
        'ix-anchor-link-title-active': isActive.value,
      }
    })

    const onClick = (evt: MouseEvent) => handleLinkClick(evt, props)

    return () => {
      const { href, title } = props
      return (
        <div class="ix-anchor-link">
          <a class={classes.value} href={href} data-href={href} title={title} onClick={onClick}>
            {slots.title?.() ?? title}
          </a>
          {slots.default?.()}
        </div>
      )
    }
  },
})
