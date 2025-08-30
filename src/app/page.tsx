import Link from 'next/link';
import { 
  RocketLaunchIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  CogIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Agent Synergy</span>
              <div className="flex items-center">
                <RocketLaunchIcon className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Agent Synergy</span>
              </div>
            </Link>
          </div>
          <div className="flex gap-x-12">
            <Link href="#features" className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary-600">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary-600">
              Pricing
            </Link>
            <Link href="#about" className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary-600">
              About
            </Link>
          </div>
          <div className="flex gap-x-4">
            <Link
              href="/auth/login"
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary-600"
            >
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero section */}
      <div className="relative isolate pt-14">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-600 to-accent-600 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Plug-and-play AI agents that work like{' '}
              <span className="text-primary-600">employees</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Transform your mid-market business with reliable, scalable AI agents that handle customer support, 
              QA testing, reporting, and more. No technical expertise required.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/auth/register"
                className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Start free trial
              </Link>
              <Link href="#demo" className="text-sm font-semibold leading-6 text-gray-900">
                Watch demo <ArrowRightIcon className="ml-1 inline h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
              <div className="mx-auto flex max-w-xs flex-col gap-y-4">
                <dt className="text-base leading-7 text-gray-600">Companies using Agent Synergy</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">500+</dd>
              </div>
              <div className="mx-auto flex max-w-xs flex-col gap-y-4">
                <dt className="text-base leading-7 text-gray-600">Time saved per month</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">40+ hrs</dd>
              </div>
              <div className="mx-auto flex max-w-xs flex-col gap-y-4">
                <dt className="text-base leading-7 text-gray-600">Average ROI</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">300%</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div id="features" className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Deploy faster</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to deploy AI agents
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            From customer support to QA testing, our AI agents are ready to work out of the box. 
            Configure them to match your company's needs and start seeing results in days, not months.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-primary-600" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                  <p className="mt-6">
                    <Link href={feature.href} className="text-sm font-semibold leading-6 text-primary-600">
                      Learn more <ArrowRightIcon className="ml-1 inline h-4 w-4" />
                    </Link>
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* CTA section */}
      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Ready to transform your business?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Join hundreds of companies already using Agent Synergy to automate their operations and boost productivity.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/auth/register"
              className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              Get started for free
            </Link>
            <Link href="/demo" className="text-sm font-semibold leading-6 text-gray-900">
              Schedule demo <ArrowRightIcon className="ml-1 inline h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    name: 'Customer Support Agent',
    description: 'Handle customer inquiries 24/7 with AI agents trained on your company policies and FAQs.',
    icon: UserGroupIcon,
    href: '/features/support',
  },
  {
    name: 'QA Testing Agent',
    description: 'Automate web and app testing with intelligent agents that find bugs and generate reports.',
    icon: CogIcon,
    href: '/features/qa',
  },
  {
    name: 'Reporting Agent',
    description: 'Generate data-driven insights and reports automatically from your business data.',
    icon: ChartBarIcon,
    href: '/features/reporting',
  },
];
