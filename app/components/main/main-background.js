export default function Background() {
    return (
        <div className="-z-10 absolute w-screen ">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop
                            offset="0%"
                            style={{ stopColor: '#0d3449', stopOpacity: '1' }}
                        />
                        <stop
                            offset="100%"
                            style={{ stopColor: '#115e87', stopOpacity: '1' }}
                        />
                    </linearGradient>
                </defs>
                <path
                    fill="url(#gradient)"
                    d="M0,200L48,180C96,160,192,130,288,120.3C384,110,480,120,576,126.7C672,130,768,130,864,120.3C960,110,1056,90,1152,73.3C1248,57,1344,47,1392,41.3L1440,40L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                ></path>
            </svg>
        </div>
    );
}
