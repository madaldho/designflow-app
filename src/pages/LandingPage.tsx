import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  ArrowPathIcon, 
  CheckCircleIcon, 
  CloudArrowUpIcon,
  EyeIcon,
  LockClosedIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const LandingPage: React.FC = () => {
  const features = [
    {
      name: 'Workflow Terstruktur',
      description: 'Sistem alur kerja dari Design → Review → Approval → Cetak yang terorganisir dan transparan.',
      icon: DocumentTextIcon,
      color: 'blue',
    },
    {
      name: 'Role-Based Access',
      description: 'Hak akses yang jelas untuk setiap peran: Requester, Designer, Reviewer, Approver, dan Percetakan.',
      icon: LockClosedIcon,
      color: 'green',
    },
    {
      name: 'Real-time Tracking',
      description: 'Monitor status proyek secara real-time dari awal hingga serah terima hasil cetak.',
      icon: RocketLaunchIcon,
      color: 'purple',
    },
    {
      name: 'Annotation Tools',
      description: 'Komentar dan coret-coret langsung pada desain untuk feedback yang jelas dan cepat.',
      icon: EyeIcon,
      color: 'orange',
    },
    {
      name: 'Multi-Device Support',
      description: 'Akses aplikasi dari desktop, tablet, maupun mobile dengan PWA technology.',
      icon: CloudArrowUpIcon,
      color: 'indigo',
    },
    {
      name: 'Secure & Reliable',
      description: 'Data aman dengan enkripsi dan backup otomatis untuk keandalan yang tinggi.',
      icon: ShieldCheckIcon,
      color: 'red',
    },
  ];

  const workflows = [
    {
      step: 1,
      title: 'Request Desain',
      description: 'User mengajukan permintaan desain dengan brief yang lengkap.',
      icon: DocumentTextIcon,
    },
    {
      step: 2,
      title: 'Proses Desain',
      description: 'Designer mengerjakan desain sesuai brief dan requirement.',
      icon: ArrowPathIcon,
    },
    {
      step: 3,
      title: 'Review & Approval',
      description: 'Reviewer memberikan feedback dan approver memberikan persetujuan final.',
      icon: EyeIcon,
    },
    {
      step: 4,
      title: 'Proses Cetak',
      description: 'Percetakan mengerjakan proses cetak berdasarkan desain yang disetujui.',
      icon: CheckCircleIcon,
    },
  ];

  const stats = [
    { name: 'Proyek Selesai', value: '2,000+', description: 'Proyek desain yang telah selesai' },
    { name: 'Active Users', value: '500+', description: 'Pengguna aktif dari berbagai lembaga' },
    { name: 'Lembaga Terdaftar', value: '100+', description: 'Pondok, yayasan, dan sekolah' },
    { name: ' Satisfaction Rate', value: '98%', description: 'Tingkat kepuasan pengguna' },
  ];

  const testimonials = [
    {
      name: 'Ahmad Fadli',
      role: 'Head of Creative Development',
      institution: 'Yayasan Pendidikan Utama',
      content: 'DesignFlow memudahkan koordinasi antara tim desain, reviewer, dan percetakan. Alur kerja jadi lebih transparan dan efisien.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      name: 'Siti Nurhaliza',
      role: 'Manager Percetakan',
      institution: 'Percetakan Maju Jaya',
      content: 'Sejak menggunakan DesignFlow, proses approval dan tracking order menjadi jauh lebih mudah. Tidak lagi ada komplain akibat kesalahan komunikasi.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      name: 'Budi Santoso',
      role: 'Kepala Sekolah',
      institution: 'SMP Negeri 1 Jakarta',
      content: 'Sangat membantu untuk mengelola semua kebutuhan desain sekolah. Dashboard-nya informatif dan mudah digunakan.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ];

  const institutions = [
    'Pondok Pesantren',
    'Yayasan Pendidikan',
    'SMP/MTs',
    'SMA/MA/SMK',
    'Percetakan',
    'Lembaga Lainnya'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white opacity-5 rounded-full translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-white opacity-5 rounded-full"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center">
                <svg className="w-12 h-12 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 animate-fade-in">
              Sistem Desain → Review → Cetak
              <span className="block text-3xl sm:text-4xl lg:text-5xl mt-4 text-primary-100">
                yang Terintegrasi
              </span>
            </h1>
            
            <p className="text-xl text-primary-100 max-w-3xl mx-auto mb-12 leading-relaxed">
              Platform end-to-end untuk mengelola alur kerja desain dari request hingga serah terima hasil cetak. 
              Cocok untuk pondok pesantren, yayasan, sekolah, dan lembaga lainnya.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                to="/register"
                className="btn bg-white text-primary-700 hover:bg-gray-50 px-8 py-4 text-lg font-medium shadow-medium hover:shadow-strong transition-all-200"
              >
                Mulai Gratis
              </Link>
              <Link
                to="/login"
                className="btn border-2 border-white text-white hover:bg-white hover:text-primary-700 px-8 py-4 text-lg font-medium transition-all-200"
              >
                Masuk ke Akun
              </Link>
            </div>

            {/* Supported Institutions */}
            <div className="flex flex-wrap justify-center gap-2">
              {institutions.map((inst, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm text-white text-sm rounded-lg"
                >
                  {inst}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{stat.name}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Fitur Unggulan DesignFlow
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Solusi komprehensif untuk mengelola alur kerja desain yang efisien dan transparan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card card-padding card-hover group"
              >
                <div className={cn(
                  'w-12 h-12 bg-gray-100 group-hover:bg-primary-100 rounded-lg flex items-center justify-center mb-4 transition-colors duration-200'
                )}>
                  <feature.icon className={cn(
                    'w-6 h-6 text-gray-600 group-hover:text-primary-600 transition-colors duration-200'
                  )} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.name}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Alur Kerja yang Terstruktur
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Proses yang jelas dan transparan dari awal hingga akhir proyek desain.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflows.map((workflow, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto">
                    <workflow.icon className="w-10 h-10 text-primary-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {workflow.step}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{workflow.title}</h3>
                <p className="text-gray-600 text-sm">{workflow.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Apa Kata Pengguna
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Lebih dari 500 lembaga telah mempercayai DesignFlow untuk mengelola proyek desain mereka.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card card-padding">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-xs text-gray-500">{testimonial.institution}</div>
                  </div>
                </div>
                <blockquote className="text-gray-700 italic">
                  "{testimonial.content}"
                </blockquote>
                <div className="flex mt-4 text-primary-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
            Siap Meningkatkan Efisiensi Workflow Desain Anda?
          </h2>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-12">
            Bergabunglah dengan ratusan lembaga yang telah mempercayai DesignFlow untuk 
            mengelola proyek desain mereka dengan lebih efisien.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn bg-white text-primary-700 hover:bg-gray-50 px-8 py-4 text-lg font-medium shadow-medium hover:shadow-strong transition-all-200"
            >
              Mulai Coba Gratis
            </Link>
            <Link
              to="/login"
              className="btn border-2 border-white text-white hover:bg-white hover:text-primary-700 px-8 py-4 text-lg font-medium transition-all-200"
            >
              Jelajahi Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                  </svg>
                </div>
                <span className="text-white font-bold text-lg">DesignFlow</span>
              </div>
              <p className="text-sm">Platform desain-review-cetak terintegrasi untuk lembaga pendidikan dan organisasi.</p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Produk</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/features" className="hover:text-white transition-colors">Fitur</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Harga</Link></li>
                <li><Link to="/integrations" className="hover:text-white transition-colors">Integrasi</Link></li>
                <li><Link to="/api" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Bantuan</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/docs" className="hover:text-white transition-colors">Dokumentasi</Link></li>
                <li><Link to="/tutorials" className="hover:text-white transition-colors">Tutorial</Link></li>
                <li><Link to="/support" className="hover:text-white transition-colors">Support</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">Tentang Kami</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Kontak</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privasi</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Syarat & Ketentuan</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; 2024 DesignFlow. Semua hak dilindungi. Made with ❤️ in Indonesia.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
