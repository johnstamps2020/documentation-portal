# PolicyCenter policy transactions

On a daily basis, producers and agents do work associated with policies. This work includes creating submissions, changing policies midterm, and any number of similar activities. In PolicyCenter, you do this work in policy transactions. Policy transactions play a central role in PolicyCenter. This topic provides an introduction to policy transactions and describes how policy transactions process information. Subsequent topics contain details on each type of policy transaction.

Policy transactions coordinate all the work associated with creating a new policy period and modifying the policy. Policy transactions are almost always referred to by type, that is to say, a submission, a policy change, or a cancellation.

**Note:** In PolicyCenter, the user interface uses the term policy transaction to refer to submissions, policy changes, and other policy transactions. Policy transactions are implemented as jobs in the data model, and referred to as jobs in PCF files, Gosu classes, and other configuration files. Therefore, the configuration documentation refers to policy transactions as jobs.

Jobs are processed by either the cloud job process (CJP) or the local job process (LJP). There are several differences between these two processes:

*   You can configure the classes in the LJP, but you can only extend the classes in the CJP.
*   You must use the CJP to take advantage of cloud functionality.
*   The CJP does not support high-volume quoting, asynchronous quoting, side-by-side quoting, or quick quote.

See also

*   [Policies](http://localhost:8081/cloud/pc/202205/app/app/pc/topics/c_bb2291841.html#c_bb2291841)

## Submission

Submission is the only policy transaction that creates a policy. A potential policyholder contacts the insurer or agent and requests a quote. The agent gathers information in order to generate one or more quotes. Based upon the apparent risk of policyholder, PolicyCenter raises underwriting issues that may require approval. If both parties agree upon a quote, then the agent binds and (optionally) issues the policy.

## Issuance

Issuance is part of the submission process. It allows you to edit and requote a bound submission before officially issuing the policy (sending out the accompanying policy forms). For example, a potential customer has a new limousine business and must insure all 30 vehicles today. The customer contacts you, the insurance agent, requesting a business auto policy. You require the VIN number and license of all vehicles, but the customer does not have these readily available. You still proceed with generating a quote and agreeing on the terms. The policy is bound (legal) today, so the customer’s limousines have coverage. The next day, the customer contacts you, provides the required information, and adds another limousine, bringing the total number of vehicles to 31. You edit, requote, and now issue the policy by using an issuance policy transaction.

## Renewal

The renewal process extends the policy for another term beyond the current expiration date. It creates a new policy period for an existing policy.

The renewal policy transaction is often automatic. For example, if there are no changes to the policy and no claims were made against it, the system creates a new policy period and sends a renewal notice. Renewal can also require that an underwriter review the policy. Processing occurs prior to expiration, but actual renewal is at expiration. Like submissions, you can create one or more quotes on a renewal.

## Cancellation

The cancellation process is a type of policy change which marks a policy as canceled. A cancellation can be initiated by the insurer. A cancellation initiated by the insurer typically requires advance notice to the policyholder. Therefore, the insurer starts the cancellation on one date, and the cancellation completes some period of time later. For example, a policyholder forgets to pay his auto policy by the due date of June 10th. On June 11th, the system starts a cancellation policy transaction for non-payment with termination of coverage effective as of a future date. The future date is usually based on regulatory requirements.

A policyholder can also initiate a cancellation. For any number of reasons, a policyholder may no longer want coverage by the insurer. According to the policyholder’s wishes, the insurer cancels the policy effective immediately or at some future date.

## Policy change

To create a policy change, you modify a policy in between the effective and expiration dates. A change can be as simple as adding an additional vehicle to an auto policy. Or it can be an out-of-sequence event, such as adding another driver to a policy on a date prior to the addition of another vehicle to the policy.

## Reinstatement

Reinstatements go hand in hand with cancellations and are a type of policy change that uncancels the policy. Reinstatement restores a canceled policy. The reinstatement date must be the same as the cancellation effective date.

## Rewrite

Policies are rewritten to make the types of changes that cannot be done in a policy change policy transaction, to correct significant errors, or to make changes to the policy. A rewrite, which can only occur on a canceled policy, effectively ends the first policy and creates a new one in its place. For example, a customer requests a workers’ compensation policy. However, when the customer receives the policy, he notices many errors: the dates and payroll amounts are incorrect, and the building and location are in the wrong jurisdiction. The customer notifies you, the agent. If you choose to fix the errors in a policy change, the system would send out an addendum, calling out the mistakes in the policy. But because there are so many mistakes in the policy, you decide to rewrite the policy which sends out completely new policy documentation.

## Rewrite new account

When you rewrite a policy to a new account, PolicyCenter creates a rewrite new account policy transaction. This policy transaction takes data from an existing policy and creates a new policy with a new policy number in the new account. Unlike a rewrite policy transaction, a rewrite new policy transaction can have pre-qualification questions. You can only rewrite canceled or expired policies to a new account.

## Audit

The audit policy transaction lets the insurer verify information about the policyholder and determine the accuracy of premiums paid. The audit policy transaction provides final audit and premium reports.

PolicyCenter supports final audit for the workers’ compensation line of business. You set up the method of final audit (physical, voluntary, or by phone) when you create the workers’ compensation policy. PolicyCenter creates audits when the current time reaches the initiation date of an audit schedule item. Unlike other policy transactions, the audit policy transaction does not create a new version of the policy, and therefore does not affect the coverage.

With premium reports the policyholder is billed for premium based on periodic requests for actual basis amounts, such as payroll. A deposit, usually a percentage of the estimated annual premium, is billed at the beginning of the policy. As each reporting period ends, the policyholder is billed based on the actual basis reported by them.