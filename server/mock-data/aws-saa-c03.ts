import type { MockExam } from "../exams/types";

export const awsSaaC03Exam: MockExam = {
  id: "aws-saa-c03-foundations",
  slug: "aws-saa-c03",
  certificationCode: "AWS SAA-C03",
  title: "AWS Solutions Architect Associate Preview Mock",
  description:
    "A small local-only mock exam focused on core architecture decisions and exam flow validation.",
  durationMinutes: 10,
  questions: [
    {
      id: "networking-vpc",
      topicLabel: "VPC routing and subnet boundaries",
      prompt:
        "A company needs a private application tier in AWS while keeping the public web tier reachable from the internet. Which design is the best fit?",
      explanation:
        "A public subnet for the web tier and a private subnet for the application tier is the standard least-exposure pattern.",
      correctOptionId: "b",
      options: [
        { id: "a", label: "A", text: "Place both tiers in one public subnet." },
        {
          id: "b",
          label: "B",
          text: "Use public subnets for the web tier and private subnets for the app tier.",
        },
        {
          id: "c",
          label: "C",
          text: "Use one private subnet and expose it directly with an internet gateway.",
        },
        {
          id: "d",
          label: "D",
          text: "Use only private subnets and remove all load balancers.",
        },
      ],
    },
    {
      id: "storage-durability",
      topicLabel: "Storage durability and service fit",
      prompt:
        "Which AWS storage service is designed for high durability of objects across multiple Availability Zones?",
      explanation:
        "Amazon S3 is designed for object durability and stores data redundantly across multiple AZs within a Region.",
      correctOptionId: "c",
      options: [
        { id: "a", label: "A", text: "Amazon EBS" },
        { id: "b", label: "B", text: "Amazon EC2 instance store" },
        { id: "c", label: "C", text: "Amazon S3" },
        { id: "d", label: "D", text: "Amazon ElastiCache" },
      ],
    },
    {
      id: "scaling-stateless",
      topicLabel: "Stateless scaling patterns",
      prompt:
        "A stateless web application must scale automatically based on demand. Which design is the best default choice?",
      explanation:
        "An Auto Scaling group behind an Application Load Balancer is the common stateless scaling pattern.",
      correctOptionId: "a",
      options: [
        {
          id: "a",
          label: "A",
          text: "Application Load Balancer with an Auto Scaling group of EC2 instances.",
        },
        {
          id: "b",
          label: "B",
          text: "One large EC2 instance with manual scaling during traffic spikes.",
        },
        { id: "c", label: "C", text: "Amazon RDS Multi-AZ only." },
        { id: "d", label: "D", text: "A single NAT gateway with no load balancer." },
      ],
    },
    {
      id: "database-read-scale",
      topicLabel: "Database read scaling",
      prompt:
        "An application reads from a relational database far more often than it writes. Which option best improves read scalability?",
      explanation:
        "Read replicas are designed to offload read traffic from the primary relational database instance.",
      correctOptionId: "d",
      options: [
        { id: "a", label: "A", text: "Enable detailed billing reports." },
        { id: "b", label: "B", text: "Move the database into one larger subnet." },
        { id: "c", label: "C", text: "Replace all reads with EBS snapshots." },
        { id: "d", label: "D", text: "Add read replicas for the database." },
      ],
    },
  ],
};
