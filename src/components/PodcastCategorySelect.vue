<template>
  <div>
    <v-autocomplete
      v-model="select"
      :loading="loading"
      :items="items"
      :search-input.sync="search"
      class="autocomplete"
      flat
      hide-no-data
      hide-details
      label="Search Genre"
      solo-inverted
      background-color="#333333"
    >
    </v-autocomplete>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: false,
      items: [],
      search: null,
      select: null,
      genres: [
        'Arts (Books, Design, Fashion & Beauty, Food, Performing Arts, & Visual Arts)',
        'Business (Careers, Entrepreneurship, Investing, Management, Marketing, & Non-Profit)',
        'Comedy (Comedy Interviews, Improv, & Stand Up)',
        'Education (Courses, How-To, Language Learning, Self-Improvement)',
        'Fiction (Comedy Fiction, Drama, Science Fiction)',
        'Government',
        'Health & Fitness (Alternative Health, Fitness, Medicine, Mental Health, Nutrition, & Sexuality)',
        'History',
        'Kids & Family (Education for Kids, Parenting, Pets & Animals, & Stories for Kids)',
        'Leisure (Animation & Manga, Automotive, Aviation, Crafts, Games, Hobbies, Home & Garden, Video Games)',
        'Music (Music Commentary, Music History, Music Interviews)',
        'News (Business News, Entertainment News, Politics, Sports News, Tech News)',
        'Religion & Spirituality (Buddhism, Christianity, Hinduism, Islam, Judaism, Religion, & Spirituality)',
        'Science (Astronomy, Chemistry, Mathematics, Natural Sciences, Physics, & Social Sciences)',
        'Society & Culture (Documentary, Personal Journals, Philosophy, Places & Travel, & Relationships)',
        'Sports',
        'Technology',
        'True Crime',
        'TV & Film (After Shows, Film History, Film Interviews, Film Reviews, & TV Reviews)',
        'None'
      ]
    }
  },
  created () {
    this.select = this.value
  },
  watch: {
    search (val) {
      val && val !== this.select && this.querySelections(val)
    },
    select (val) {
      this.$emit('input', val)
    },
    value (val) {
      this.select = val
    }
  },
  methods: {
    xx () {

    },
    querySelections (v) {
      this.loading = true
      // Simulated ajax query
      setTimeout(() => {
        this.items = this.genres.filter(e => {
          return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1
        })
        this.loading = false
      }, 500)
    }
  }
}
</script>

<style lang="less" scoped>
.autocomplete {
  /deep/ .v-label.theme--light{
    color: white;
  }

  /deep/ .v-icon.mdi-menu-down.theme--light {
    color: white;
    &.primary--text {
      color: #E56D9B !important;
      caret-color: #E56D9B !important;
    }
  }
}
</style>
