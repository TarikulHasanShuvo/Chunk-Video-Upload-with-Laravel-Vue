var app = new Vue({
    el   : '#video-upload',
    watch: {
        chunks(n, o) {
            if (n.length > 0) {
                this.upload();
            }
        }
    },
    data : {
        chunks              : [],
        uploaded            : 0,
        chunkedVideoPath    : null,
        showButtonDuringEdit: false,
        file                : null,

    },
    mounted() {
        setTimeout(() => {
            const place = document.querySelector("[name='video']");
            if (typeof place != 'undefined' && place != null) {
                place.addEventListener('change', () => {
                    this.file = place.files[0]
                    this.createChunks();
                })
            }
        }, 500)
    },
    methods: {
        upload() {
            axios(this.config).then(response => {
                this.chunks.shift();
                if (!response.data.path.includes('.part')) {
                    this.chunkedVideoPath = response.data.path;
                }
            }).catch(error => {
                console.log(error)
            });
        },
        createChunks() {
            if(this.file == null){
                return;
            }
            let size   = 1000000,
                chunks = Math.ceil(this.file.size / size);

            for (let i = 0; i < chunks; i++) {
                this.chunks.push(this.file.slice(
                    i * size, Math.min(i * size + size, this.file.size), this.file.type
                ));
            }
        }
    },

    computed: {
        progress() {
            if(this.file == null){
                return 0;
            }
            return Math.floor((this.uploaded * 100) / this.file.size);
        },
        formData() {
            let formData = new FormData;

            formData.set('is_last', this.chunks.length === 1);
            formData.set('file', this.chunks[0], `${this.file.name}.part`);

            return formData;
        },
        config() {
            return {
                method          : 'POST',
                data            : this.formData,
                url             : '/upload_video_using_chunk',
                headers         : {
                    'Content-Type': 'application/octet-stream'
                },
                onUploadProgress: event => {
                    this.uploaded += event.loaded;
                }
            };
        }
    },
})


