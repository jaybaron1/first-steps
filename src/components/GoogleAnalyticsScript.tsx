import { Helmet } from 'react-helmet-async';

const GA_MEASUREMENT_ID = 'G-2NHHE1D4WZ';

const GoogleAnalyticsScript = () => {
  return (
    <Helmet>
      {/* Google Analytics 4 */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            send_page_view: false,
            cookie_flags: 'SameSite=None;Secure'
          });
          
          // Enhanced measurement settings
          gtag('config', '${GA_MEASUREMENT_ID}', {
            'custom_map': {
              'dimension1': 'plan_type',
              'dimension2': 'source_page',
              'metric1': 'conversion_value'
            }
          });
        `}
      </script>
    </Helmet>
  );
};

export default GoogleAnalyticsScript;
