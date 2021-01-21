<template>
    <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
        <li 
            :class="['page-item', {disabled : page <= 1 }]" 
            @click.prevent="goPage(page - 1)"
        >
            <a class="page-link" href="#">Previous</a>
        </li>
        <li 
            v-for="pageNum in length"
            :class="['page-item', {active : page === pageNum}]" 
            @click.prevent="goPage(pageNum)" 
            :key="pageNum"
        >
            <a class="page-link" href="#">{{pageNum}}</a>
        </li>
        <li 
            :class="['page-item', {disabled : page >= length }]" 
            @click.prevent="goPage(page + 1)"
        >
            <a class="page-link" href="#">Next</a>
        </li>
        </ul>
    </nav>
</template>

<script>
export default {
    props:{
        length: {
            default: 0
        },
        page: {
            default: 0
        }
    },
    methods: {
        goPage(targetPage) {
            if (targetPage >= 1 && targetPage <= this.length) {
                this.$emit('input', targetPage)
            }
        },
    },
}
</script>

<style>
    .pagination .page-item{
        user-select: none;
    }
</style>