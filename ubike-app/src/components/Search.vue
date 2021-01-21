<template>
    <input type="text" v-model.trim="searchName">
</template>

<script>
export default {
    data() {
        return {
            searchName: ''    
        }
    },
    watch:{
        searchName() {
            this.$emit('search', this.searchName)
        }
    }
}
</script>

<style>

</style>