import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
export default function page() {
    return (
        <div className="dashboard text-white">
            <div className="top grid grid-cols-4 md:gap-x-10">
                <div className="box font-bold text-xl flex items-center justify-between">
                    <p>New Tasks</p>
                    <button className='flex'>
                        <MoreHorizIcon className='!text-3xl' />
                    </button>
                </div>
                <div className="box font-bold text-xl flex items-center justify-between">
                    <p>In Process</p>
                    <button className='flex'>
                        <MoreHorizIcon className='!text-3xl' />
                    </button>
                </div>
                <div className="box font-bold text-xl flex items-center justify-between">
                    <p>In Test</p>
                    <button className='flex'>
                        <MoreHorizIcon className='!text-3xl' />
                    </button>
                </div>
                <div className="box font-bold text-xl flex items-center justify-between">
                    <p>Done</p>
                    <button className='flex'>
                        <MoreHorizIcon className='!text-3xl' />
                    </button>
                </div>
            </div>
        </div>
    );
};