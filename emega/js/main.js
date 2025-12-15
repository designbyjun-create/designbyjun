const { createApp, ref, onMounted, reactive } = Vue;

createApp({
    setup() {
        const windowWidth = ref(0);

        onMounted(() => {
            windowWidth.value = window.innerWidth;
            AOS.init({ once: true, offset: 0, duration: 1000 });
            handleSwiper();
        });

        const handleSwiper = () => {
            new Swiper(".section-film-swiper", {
                loop: true,
                autoHeight: true,
                navigation: {
                    nextEl: ".section-film-swiper-button-next",
                    prevEl: ".section-film-swiper-button-prev",
                },
            });
            new Swiper(".section-1-swiper", {
                loop: true,
                autoHeight: true,
                navigation: {
                    nextEl: ".section-1-swiper-button-next",
                    prevEl: ".section-1-swiper-button-prev",
                },
            });
            new Swiper(".section-2-swiper", {
                loop: true,
                autoHeight: true,
                navigation: {
                    nextEl: ".section-2-swiper-button-next",
                    prevEl: ".section-2-swiper-button-prev",
                },
            });
        };

        // 圖片載入後更新高度
        document.querySelectorAll('.section-film-swiper iframe').forEach(f => {
            f.addEventListener('load', () => {
                swiper.updateAutoHeight();
            });
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
