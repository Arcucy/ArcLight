<template>
  <v-dialog
    v-model="showDialog"
    width="360"
    @click:outside="outsideReset"
  >
    <v-card dark class="wallet">
      <h3 class="keyreader-title">
        {{ $t('insertYourKey') }}
      </h3>
      <div class="file-input-area" id="file-input-area">
        <v-icon v-if="!file" >mdi-plus</v-icon>
        <span v-else >{{ fileName }}</span>
        <input class="file-input" id="file-input" type="file" accept="application/json">
      </div>
      <p class="keyreader-content">
        {{ $t('pleaseInsertYourWalletKey') }}
      </p>
      <v-btn class="wallet-upload-button" depressed color="#E56D9B" :disabled="disallowStep2" block @click="step2">
        Upload key
      </v-btn>
    </v-card>
    <v-snackbar
      v-model="failSnackbar"
      color="#E53935"
      timeout="3000"
      top="top"
      style="margin-top: 16px;"
    >
      {{ failMessage }}

      <template v-slot:action="{ attrs }">
        <v-btn
          dark
          text
          v-bind="attrs"
          @click="failSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      showDialog: this.value,
      failSnackbar: false,
      failMessage: '',
      disallowStep2: true,
      keyFileContent: '',
      file: null,
      fileName: ''
    }
  },
  computed: {
  },
  watch: {
    value (val) {
      this.showDialog = val
    },
    showDialog (val) {
      this.setShowStatus(val)
      if (val) {
        setTimeout(() => {
          const fileInput = document.getElementById('file-input')
          const droparea = document.getElementById('file-input-area')

          fileInput.addEventListener('dragenter', () => {
            this.addClass(droparea, 'is-active')
          })
          fileInput.addEventListener('click', () => {
            this.addClass(droparea, 'is-active')
          })
          fileInput.addEventListener('focus', () => {
            this.addClass(droparea, 'is-active')
          })

          fileInput.addEventListener('dragleave', () => {
            this.removeClass(droparea, 'is-active')
          })
          fileInput.addEventListener('blur', () => {
            this.removeClass(droparea, 'is-active')
          })
          fileInput.addEventListener('drop', () => {
            this.removeClass(droparea, 'is-active')
          })

          fileInput.addEventListener('change', () => {
            this.disAllowStep2 = true
            this.file = fileInput.files[0]
            const reader = new FileReader()
            reader.readAsText(this.file)
            reader.onload = async (e) => {
              try {
                this.keyFileContent = JSON.parse(e.target.result)
                this.fileName = this.file.name
                this.disallowStep2 = false
              } catch (err) {
                this.failSnackbar = true
                this.failMessage = 'Unsupported File Type, Key file must be JSON'
              }
            }
          })
        }, 500)
      }
    }
  },
  methods: {
    addClass (elem, className) {
      elem.classList.add(className)
    },
    removeClass (elem, className) {
      elem.classList.remove(className)
    },
    outsideReset () {
      const fileInput = document.getElementById('file-input')
      const droparea = document.getElementById('file-input-area')
      fileInput.removeEventListener('dragenter', () => {})
      fileInput.removeEventListener('click', () => {})
      fileInput.removeEventListener('focus', () => {})
      fileInput.removeEventListener('dragleave', () => {})
      fileInput.removeEventListener('blur', () => {})
      fileInput.removeEventListener('drop', () => {})
      fileInput.removeEventListener('change', () => {})
      if (fileInput) {
        this.removeClass(droparea, 'is-active')
      }

      this.showDialog = false
    },
    step2 () {
      this.$emit('key-file', this.keyFileContent)
      this.showDialog = false
    },
    setShowStatus (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="less" scoped>
.keyreader-title {
  margin-bottom: 24px;
  text-align: left;
}

.wallet {
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .keyreader-content {
    margin-top: 24px;
    margin-bottom: 24px;
    text-align: left;
  }
}

#file-input-area {
  padding: 76px 24px 76px 24px;
  margin: 0 auto;
  height: 156px;
  width: 312px;
  border-radius: 4px;
  border: 2px dashed #B2B2B2;
  display: flex;
  justify-content: center;
  align-items: center;
  &.is-active {
    background-color: rgba(255, 255, 255, 0.171);
  }
  .file-input {
    position: absolute;
    left: 24px;
    top: 76px;
    height: 156px;
    width: 312px;
    cursor: pointer;
    opacity: 0;
    &:focus {
      outline: none;
    }
  }
}
</style>
