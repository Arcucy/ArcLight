import Vue from 'vue'
import Header from '@/components/Header.vue'
import Landing from '@/pages/Landing.vue'

describe('Header.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Header)
    const vm = new Constructor().$mount()
    // expect(vm.$el.querySelector('.text-link').textContent)
    // .to.equal('Welcome to Your Vue.js App')
    console.log(vm.$el.querySelector('.text-link').textContent)
  })
})

describe('Header.vue', () => {
  it('should exist', () => {
    expect(Header).toBeDefined()
  })
})
describe('Header.vue', () => {
  it('should exist', () => {
    expect(Landing).toBeDefined()
  })
})
