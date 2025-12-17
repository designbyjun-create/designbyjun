const { createApp, ref, onMounted, reactive } = Vue;

createApp({
    setup() {
        const windowWidth = ref(0);

        onMounted(() => {
            windowWidth.value = window.innerWidth;
            AOS.init({ once: true, offset: 0, duration: 1000 });
        });

        return {
            windowWidth,
        };
    },
}).mount("#app");

// 滾動
async function scrollTo({
    target,
    behavior = "smooth",
    block = "start",
    inline = "nearest",
    delay = false,
}) {
    const scroll = () => {
        const el = document.querySelector(target);
        el?.scrollIntoView({ behavior, block, inline });
    };

    if (delay) {
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 0);
        });
        scroll();
    } else scroll();
}