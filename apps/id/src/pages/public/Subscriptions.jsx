import PageHeader from '../../components/PageHeader';
import Button from '../../components/ui/Button';
import { Card, CardBody, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { CheckCircle, Clock } from 'lucide-react';
import { subscriptionData, transactionsData } from '../../data/mockData';
import Badge from '../../components/ui/Badge';
import { formattedDate } from '../../utils';
import '../../styles/public/Subscriptions.scss';

export default function Subscriptions() {
    const handleBack = () => {
        window.history.back();
    }

    return (
        <div className='subscriptions'>
            <PageHeader
                onClick={handleBack}
                location={'Paiements & Abonnements'}
                title={'Paiements & Abonnements'}
                description={"Gérez vos abonnements, vos modes de paiement et votre historique de facturation"}
            />

            {/* Active subscriptions */}
            <Card className="active-subscriptions-card">
                <CardHeader>
                    <CardTitle className="card-title-icon">
                        <CheckCircle size={18} className="icon-title" />
                        Active Subscriptions
                    </CardTitle>
                    <CardDescription>Your current subscription plans</CardDescription>
                </CardHeader>
                <CardBody>
                    {subscriptionData.length > 0 ? (
                        <div className="subscription-list space-y-6">
                            {subscriptionData.map(subscription => (
                                <div
                                    key={subscription.id}
                                    className="subscription-item"
                                >
                                    <div className="subscription-info">
                                        <div>
                                            <div className="subscription-details">
                                                <h3 className="subscription-name">{subscription.name}</h3>
                                                <Badge
                                                    variant={subscription.status === 'active' ? 'success' : 'warning'}
                                                    className={subscription.status === 'active' ? 'text-green' : 'text-yellow'}
                                                >
                                                    {subscription.status}
                                                </Badge>
                                            </div>
                                            <p className="billing-cycle">
                                                {subscription.billingCycle === 'monthly' ? 'Monthly Plan' : 'Yearly Plan'}
                                            </p>
                                        </div>
                                        <div className="mt-3 sm:mt-0">
                                            <p className="subscription-amount text-xl font-semibold text-gray-900">
                                                {subscription.amount.toFixed(2)} {subscription.currency}
                                                <span className="billing-interval text-sm text-gray-500 font-normal">
                                                    {subscription.billingCycle === 'monthly' ? '/month' : '/year'}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="subscription-dates">
                                        <div>
                                            <p className="text-gray">Start Date</p>
                                            <p className="font-medium">{formattedDate(subscription.startDate)}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray">End Date</p>
                                            <p className="font-medium">{formattedDate(subscription.endDate)}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray">Next Billing</p>
                                            <p className="font-medium">{formattedDate(subscription.renewalDate)}</p>
                                        </div>
                                    </div>

                                    <div className="subscription-actions">
                                        <Button size="sm" className="manage-plan-button">Manage Plan</Button>
                                        <Button variant="outline" size="sm" className="cancel-plan-button">Cancel Plan</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-subscriptions text-center py-8">
                            <p className="text-gray-500">You don't have any active subscriptions</p>
                            <Button className="mt-4 explore-plans-button">Explore Plans</Button>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Billing history */}
            <Card className='billing'>
                <CardHeader>
                    <CardTitle className="billing-title">
                        <Clock size={18} className="billing-title__icon" />
                        Billing History
                    </CardTitle>
                    <CardDescription className="billing-description">
                        View your past transactions and invoices
                    </CardDescription>
                </CardHeader>

                <CardBody className="billing-content">
                    <div className="billing-table__wrapper">
                        <table className="billing-table">
                            <thead>
                                <tr className="billing-table__head-row">
                                    <th className="billing-table__head-cell">Date</th>
                                    <th className="billing-table__head-cell">Description</th>
                                    <th className="billing-table__head-cell">Amount</th>
                                    <th className="billing-table__head-cell">Status</th>
                                    <th className="billing-table__head-cell billing-table__head-cell--right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="billing-table__body">
                                {transactionsData.map(transaction => (
                                    <tr key={transaction.id} className="billing-table__row">
                                        <td className="billing-table__cell">{formattedDate(transaction.date)}</td>
                                        <td className="billing-table__cell">{transaction.description}</td>
                                        <td className="billing-table__cell billing-table__cell--bold">
                                            {transaction.amount.toFixed(2)} {transaction.currency}
                                        </td>
                                        <td className="billing-table__cell">
                                            <Badge
                                                className={
                                                    transaction.status === 'completed'
                                                        ? 'success'
                                                        : transaction.status === 'pending'
                                                            ? 'warning'
                                                            : 'error'
                                                }
                                                variant={
                                                    transaction.status === 'completed'
                                                        ? 'success'
                                                        : transaction.status === 'pending'
                                                            ? 'warning'
                                                            : 'error'
                                                }
                                                size="sm"
                                            >
                                                {transaction.status}
                                            </Badge>
                                        </td>
                                        <td className="billing-table__cell billing-table__cell--right">
                                            <Button variant="ghost" size="sm">Receipt</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardBody>

                <CardFooter className="billing-footer">
                    <Button variant="outline" size="sm">Download All Invoices</Button>
                </CardFooter>
            </Card>

        </div>
    );
};
