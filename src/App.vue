<template>
    <div id="app">
        <single-area/>
    </div>
</template>

<script>
    import SingleArea from "./components/single-area";
    import Single2 from "./components/single2";
    export default {
        name: 'app',
        components: {Single2, SingleArea},
        data() {
            return {
            }
        }
    }
</script>

<style>
    #app {
        display: flex;
    }
</style>
