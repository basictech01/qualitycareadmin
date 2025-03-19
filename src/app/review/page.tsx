import React from 'react';

const ReviewPage: React.FC = () => {
    return (
        <div className='row gy-4'>
					<Review />
					<Review />
					<Review />
					<Review />
					<Review />
					<Review />
					<Review />
        </div>
      );
};

const Review = () => {
    return (
    <div className='col-xxl-4 col-md-6'>
      <div className='card rounded-3 overflow-hidden h-100'>
        <div className='card-body p-24'>
          <div className='d-flex align-items-start justify-content-between gap-2'>
            <div className='d-flex align-items-center gap-12 flex-wrap'>
              <div className='w-56-px h-56-px overflow-hidden flex-shrink-0'>
                <img
                  src='assets/images/user-list/user-list1.png'
                  alt=''
                  className='w-100 h-100 object-fit-cover rounded-circle'
                />
              </div>
              <div className='d-flex flex-column flex-grow-1'>
                <h6 className='text-xl mb-0'>Robert Fox</h6>
                <span className='text-neutral-500'>Prime Investments</span>
              </div>
            </div>
            <ul className='d-flex align-items-center justify-content-end gap-1'>
              <li className='text-warning-600 text-xl d-flex line-height-1'>
                <i className='ri-star-fill' />
              </li>
              <li className='text-warning-600 text-xl d-flex line-height-1'>
                <i className='ri-star-fill' />
              </li>
              <li className='text-warning-600 text-xl d-flex line-height-1'>
                <i className='ri-star-fill' />
              </li>
              <li className='text-warning-600 text-xl d-flex line-height-1'>
                <i className='ri-star-fill' />
              </li>
              <li className='text-neutral-600 text-xl d-flex line-height-1'>
                <i className='ri-star-fill' />
              </li>
            </ul>
          </div>
          <p className='mt-24 text-neutral-500 text-lg mb-0'>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magni
            ea, voluptatem adipisci dignissimos pariatur, nulla, amet quas
            laborum sit sint laudantium fuga. Vitae hic, facilis asperiores
            reiciendis quis qui reprehenderit.
          </p>
        </div>
      </div>
    </div>
    )
}

export default ReviewPage;