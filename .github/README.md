# GitHub Actions Workflows

This directory contains automated workflows for the alexa-nodejs workspace to ensure code quality, security, and streamlined releases.

## 🔧 Workflows Overview

### 1. **PR Checks** (`pr-checks.yml`)
**Trigger**: Pull requests to `main` or `dev` branches

**Purpose**: Comprehensive validation of pull requests before merging

**Jobs**:
- **Lint and Format Check**: Code formatting and ESLint validation
- **TypeScript Type Check**: Strict TypeScript compilation checks
- **Build and Test**: Multi-Node.js version testing (16, 18, 20)
- **Security Check**: Dependency vulnerability scanning
- **Package Validation**: Workspace dependency verification and n8n package creation
- **Documentation Check**: README completeness and documentation quality
- **Final Validation**: Clean build verification and summary

**Status**: ✅ **Required** - Blocks PR merging if failed

### 2. **Advanced Checks** (`advanced-checks.yml`)
**Trigger**: Pull requests to `main` or `dev` branches (optional)

**Purpose**: Additional code quality insights and compatibility testing

**Jobs**:
- **Code Quality Analysis**: Bundle size analysis, TODO/FIXME detection, console.log checks
- **Compatibility Check**: Testing across Node.js versions 16, 18, 20, 22
- **Performance Check**: Build time monitoring and TypeScript compilation performance
- **Documentation Quality**: README completeness scoring and code comment coverage
- **Dependency Analysis**: Dependency tree analysis and license compliance

**Status**: ℹ️ **Informational** - Does not block PRs, provides insights

### 3. **Release** (`release.yml`)
**Trigger**: 
- Push to `main` branch
- Version tags (`v*`)
- Manual workflow dispatch

**Purpose**: Automated package building, testing, and publishing

**Jobs**:
- **Test Before Release**: Final validation before publishing
- **Build Packages**: Create distributable packages and artifacts
- **Publish to npm**: Automated npm publication (requires `NPM_TOKEN` secret)
- **Create GitHub Release**: Generate GitHub releases with assets
- **Notify Completion**: Release summary and installation instructions

**Status**: 🚀 **Release Pipeline** - Handles production deployments

### 4. **Dependency Update** (`dependency-update.yml`)
**Trigger**: 
- Weekly schedule (Mondays at 9 AM UTC)
- Manual workflow dispatch

**Purpose**: Automated dependency maintenance and security monitoring

**Jobs**:
- **Update Dependencies**: Automated patch/minor version updates with PR creation
- **Security Audit**: Vulnerability scanning with issue creation for critical findings
- **License Check**: License compliance monitoring with reports

**Status**: 🔄 **Maintenance** - Keeps dependencies current and secure

## 📋 Workflow Requirements

### Secrets Configuration

For full functionality, configure these repository secrets:

```
NPM_TOKEN          # npm authentication token for publishing
GITHUB_TOKEN       # GitHub token (automatically provided)
```

### Repository Settings

1. **Branch Protection Rules**:
   - Require PR reviews
   - Require status checks (PR Checks workflow)
   - Require up-to-date branches
   - Include administrators

2. **Actions Permissions**:
   - Allow GitHub Actions to create pull requests
   - Allow workflows to write to repository

## 🎯 Workflow Usage

### For Contributors

1. **Create Pull Request**:
   ```bash
   git checkout -b feature/new-feature
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   # Create PR via GitHub UI
   ```

2. **Automatic Checks Run**:
   - PR Checks workflow validates your changes
   - Advanced Checks provide additional insights
   - Fix any failing checks before merge

3. **Merge Process**:
   - All required checks must pass
   - Code review approval required
   - Squash and merge recommended

### For Maintainers

1. **Release Process**:
   ```bash
   # Update version numbers in package.json files
   git commit -m "chore: bump version to 1.1.0"
   git tag v1.1.0
   git push origin main --tags
   ```

2. **Manual Release**:
   - Go to Actions → Release workflow
   - Click "Run workflow"
   - Select release type (patch/minor/major)

3. **Dependency Management**:
   - Review weekly dependency update PRs
   - Address security issues promptly
   - Monitor license compliance reports

## 🔍 Workflow Details

### Build Matrix

| Node.js Version | Purpose | Status |
|----------------|---------|--------|
| 16 | Minimum supported | Compatibility check |
| 18 | LTS | Full testing |
| 20 | Current LTS | Primary development |
| 22 | Latest | Future compatibility |

### Package Validation

Each workflow validates:
- ✅ TypeScript compilation
- ✅ Package building
- ✅ Workspace dependencies
- ✅ n8n node structure
- ✅ Documentation completeness
- ✅ Security vulnerabilities
- ✅ License compliance

### Quality Gates

**Required for Merge**:
- All packages build successfully
- TypeScript type checking passes
- No ESLint errors (warnings allowed)
- Package.json files are valid
- Required documentation exists

**Optional but Recommended**:
- Good bundle size performance
- Minimal TODO/FIXME comments
- Adequate code documentation
- No console.log in production code

## 🚨 Troubleshooting

### Common Issues

**Build Failures**:
```bash
# Locally reproduce the issue
yarn install --immutable
yarn build
```

**Type Errors**:
```bash
# Check TypeScript compilation
cd packages/package-name
npx tsc --noEmit --strict
```

**Dependency Issues**:
```bash
# Clear cache and reinstall
yarn cache clean
rm -rf node_modules
yarn install
```

**Test Failures**:
```bash
# Run tests locally
yarn test
```

### Workflow Debugging

1. **Check workflow logs** in GitHub Actions tab
2. **Review artifact downloads** for build outputs
3. **Examine step summaries** for detailed information
4. **Use workflow dispatch** for manual testing

### Security Issues

If security vulnerabilities are found:
1. Review the created GitHub issue
2. Update vulnerable dependencies
3. Test thoroughly after updates
4. Consider security patches if needed

## 📊 Monitoring

### Workflow Success Rates
- Monitor workflow success rates in the Actions tab
- Set up notifications for workflow failures
- Review performance trends over time

### Dependency Health
- Weekly dependency update PRs
- Security audit reports
- License compliance monitoring

### Code Quality Metrics
- Bundle size trends
- Build time performance
- Documentation coverage
- TypeScript compliance

## 🔄 Maintenance

### Regular Tasks

**Weekly**:
- Review dependency update PRs
- Check security audit results
- Monitor workflow performance

**Monthly**:
- Review and update workflow configurations
- Update Node.js versions in matrix
- Check for new GitHub Actions versions

**Quarterly**:
- Review overall workflow effectiveness
- Update documentation
- Consider new quality checks

## 📖 Related Documentation

- [Contributing Guidelines](../CONTRIBUTING.md) (if available)
- [Release Process](../docs/release-process.md) (if available)
- [Security Policy](../SECURITY.md) (if available)
- [Workspace README](../README.md)

## 🤝 Contributing to Workflows

To improve the workflows:

1. Create a feature branch
2. Modify workflow files
3. Test with workflow dispatch
4. Create PR with clear description
5. Monitor workflow runs after merge

**Best Practices**:
- Use semantic commit messages
- Document workflow changes
- Test thoroughly before merging
- Consider backward compatibility
- Monitor performance impact 