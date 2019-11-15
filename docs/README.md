<script>
export default {
    mounted() {
        var language = navigator.language || navigator.browserLanguage;
        if (language.indexOf("zh") != -1) {
            location.href = "./zh";
        } else {
            location.href = "./en";
        }
    }
}
</script>